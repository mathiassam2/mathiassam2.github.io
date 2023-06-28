document.querySelector("#clear-path").addEventListener("click",clearGrid);
document.querySelector("#clear").addEventListener("click",(e)=>{clearGrid(0,false,true); e.target.disabled = true; document.querySelector("#clear-path").disabled = true;});
document.querySelector("#clear-path").addEventListener("click",(e)=>{clearGrid(); e.target.disabled = true;});
document.querySelector("#maze-recursive-backtracker").addEventListener("click",() => generateMaze("backtracker"));
document.querySelector("#visualize").addEventListener("click",visualize);
document.querySelector("#dijkstra").addEventListener("click",() => makeChoice("Dijkstra (UCS)"));
document.querySelector("#astar").addEventListener("click",() => makeChoice("A*"));
document.querySelector("#greedybest").addEventListener("click",() => makeChoice("Greedy Best First"));
document.querySelector("#visualize-all").addEventListener("click",() => makeChoice("All"));
document.getElementById("reset").addEventListener("click", function() {
  location.reload();
});
let status = 0;
let running = "";
let runningMessage = "";
const height = window.innerHeight|| document.documentElement.clientHeight||
document.body.clientHeight;
const width = window.innerWdith || document.documentElement.clientWidth ||
document.body.clientWidth;

function generateMaze(choice){
  document.querySelector("#visualize").textContent = `Visualize`
  document.querySelector("#visualize").disabled = true;
  document.querySelector("#clear").disabled = true;
  document.querySelector("#clear-path").disabled = true;
  document.querySelector("#path-finding-grp-btn").disabled = true;
  document.querySelector("#maze-generation-grp-btn").disabled = true;
  document.querySelector("#breakpoint-toggler").click();
  if(width < height){
    setTimeout(() => document.querySelector("#grid-container").scrollIntoView({behaviour:"smooth"}),0);
  }else{
    setTimeout(() => document.querySelector("#grid-helper").scrollIntoView({behaviour:"smooth"}),0);
  }
  switch(choice){
    case "prim": generateMazePrimRT(nodes); break;
    case "backtracker": recursiveBacktrackerRT(nodes); break;
  }
}

function pathFinderTab(){
  clearToasts();
  let shortcutToastTriggerEl = document.getElementById('shortcut-toast')
  let shortcutToast = new mdb.Toast(shortcutToastTriggerEl)
  shortcutToast.show()
  // document.querySelector("#breakpoint-toggler").click();
  setTimeout(() => shortcutToast.hide(),6500);

}

function visualize(){
  running = runningMessage;
  document.querySelector("#visualize").disabled = true;
  document.querySelector("#clear").disabled = true;
  document.querySelector("#clear-path").disabled = true;
  document.querySelector("#path-finding-grp-btn").disabled = true;
  document.querySelector("#maze-generation-grp-btn").disabled = true;
  document.querySelector("#breakpoint-toggler").click();
  if(width < height){
    setTimeout(() => document.querySelector("#grid-container").scrollIntoView({behaviour:"smooth"}),0);
  }else{
    setTimeout(() => document.querySelector("#grid-helper").scrollIntoView({behaviour:"smooth"}),0);
  }
  // document.querySelector("#grid-helper").scrollIntoView({
  //   behaviour:"smooth"
  // });
  switch(running){
    case "Dijkstra (UCS)": executeDijkstra(); break;
    case "A*": executeAstar(); break;
    case "Greedy Best First": executeGreedyBestFirst(); break;
    case "All":
      executeDijkstra();
      executeAstar();
      executeGreedyBestFirst(); break;
  }
}


function visualizeRT(){
  switch(running){
    case "Dijkstra (UCS)": dijkstraRT(nodes,startNode,endNode); break;
    case "A*": astarRT(nodes,startNode,endNode); break;
    case "Greedy Best First": greedyBestRT(nodes,startNode,endNode); break;
    case "All":
      dijkstraRT(nodes,startNode,endNode);
      astarRT(nodes,startNode,endNode);
      greedyBestRT(nodes,startNode,endNode); break;

  }
  document.querySelector("#clear").disabled = false;
  document.querySelector("#clear-path").disabled = false;
}
function makeChoice(choice){
  running = "";
  //clearGrid(1);
  runningMessage = choice;
  let btn = document.querySelector("#visualize");
  btn.disabled = false;
  btn.textContent = `Visualize ${choice}`

}

function executeRecursiveBacktrackerMazeGeneration(){
  clearGrid(0,false,false);
  document.querySelector("#breakpoint-toggler").click();
  for(let i = 0 ; i < nodes.length ; ++i){
    for(let j = 0 ; j < nodes[i].length ; ++j){
      nodes[i][j].divReference.classList.add("node-wall");
      nodes[i][j].isWall = true;
    }
  }

  let cell = nodes[Math.floor(Math.random() * nodes.length)][Math.floor(Math.random() * nodes[0].length)];
  let s = [];
  cell.isWall = false;
  cell.divReference.classList.remove("node-wall");
  let choices = [[-2,0],[0,2],[2,0],[0,-2]];
  let neighbours = computeFrontierCellsRBT(nodes,cell,choices);
  let rnd = Math.floor(Math.random () * neighbours.length);
  s.push(neighbours[rnd]);
  setTimeout(recursiveBacktracker,0,nodes,s,choices);
}

function executeAstar(){
  if(!nodes || !startNode || !endNode){
    return;
  }
  //clearGrid();
  let parentMap = new Map();
  let distanceMap = new Map();
  let hMap = new Map();
  let processed = new Set();
  let minHeap = [];
  let choices = [[-1,0],[1,0],[0,1],[0,-1]];
  let curr = startNode;
  minHeap.push(curr);
  let h = 0;
  for(let i = 0 ; i < nodes.length ; ++i){
    for(let j = 0 ; j < nodes[i].length ; ++j){
      distanceMap.set(nodes[i][j],Infinity);
      h = Math.abs(nodes[i][j].row - endNode.row) + Math.abs(nodes[i][j].col - endNode.col);
      hMap.set(nodes[i][j],h);
    }
  }
  distanceMap.set(curr, 0);
  parentMap.set(curr, null);
  setTimeout(astar,0,nodes,startNode,endNode,parentMap,distanceMap,hMap,processed,minHeap,choices);
}

function executeDijkstra(){
  if(!nodes || !startNode || !endNode)
  {
    return;
  }
  //clearGrid();
  let curr = startNode;
  let distanceMap = new Map();
  let processed = new Set();
  let choices = [[1,0],[-1,0],[0,-1],[0,1]];
  let parentMap = new Map();
  parentMap.set(curr,null);
  for(let i = 0 ; i < nodes.length ; ++i){
    for(let j = 0 ; j < nodes[i].length ; ++j){
      distanceMap.set(nodes[i][j],Infinity);
    }
  }
  distanceMap.set(curr,0);
  // let minHeap = new MinHeap();
  let minHeap = [];
  // minHeap.insert(curr);
  minHeap.push(curr);
  setTimeout(dijkstra,0,nodes,startNode,endNode,distanceMap,processed,choices,parentMap,minHeap)
}

function executeGreedyBestFirst(){
  if(!nodes || !startNode || !endNode)
  {
    return;
  }
  //clearGrid();
  let heuristicMap = new Map();
  let minHeap = [];
  let parentMap = new Map();
  let curr = startNode;
  let choices = [[-1,0],[1,0],[0,1],[0,-1]];
  for(let i = 0 ; i < nodes.length ; ++i){
    for(let j = 0 ; j < nodes[i].length ; ++j){
      heuristicMap.set(nodes[i][j], Math.abs(nodes[i][j].row - endNode.row) + Math.abs(nodes[i][j].col - endNode.col));
    }
  }
  parentMap.set(curr, null);
  minHeap.push(curr);

setTimeout(greedyBest,0,nodes, startNode, endNode, heuristicMap,minHeap,parentMap,choices);
}

function executeDrawPath(parentMap,endNode){
  let path = getPath(parentMap,endNode);
  setTimeout(drawPath,0,0,path);
}

function clearGrid(statusVal = 0, keep = true, initials=true){
  clearToasts();
  if(!keep){
    grid.addEventListener("click",divClicked);
  }
  for(let i = 0 ; i < nodes.length ; ++i){
    for(let j = 0 ; j < nodes[i].length ; ++j){
      nodes[i][j].divReference.className = "node";
        if(nodes[i][j].isStart){
          if(keep || initials){
            nodes[i][j].divReference.classList.add("node-start");
          }else{
            startNode = null;
            nodes[i][j].isStart = false;
          }
        }
        if(nodes[i][j].isEnd){
          if(keep || initials){
            nodes[i][j].divReference.classList.add("node-end");
          }else{
            endNode = null;
            nodes[i][j].isEnd = false;
          }
        }
        if(nodes[i][j].isWall){
          if(keep){
            nodes[i][j].divReference.classList.add("node-wall");
          }else{
            nodes[i][j].isWall = false;
          }
        }
        if(nodes[i][j].weight){
          if(keep){
            nodes[i][j].divReference.classList.add(`node-strong-${nodes[i][j].weight}`);
          }else{
            nodes[i][j].weight = 0;
          }
        }
      }
    }
  status = statusVal;
  //location.reload();
}

function chooseRndStartEnd(){
  let rows = nodes.length;
  let cols = nodes[0].length;
  let startRndRow = Math.floor(Math.random() * rows);
  let startRndCol = Math.floor(Math.random() * cols);
  while(nodes[startRndRow][startRndCol].isWall){
    startRndRow = Math.floor(Math.random() * rows);
    startRndCol = Math.floor(Math.random() * cols);
  }
  let endRndRow = Math.floor(Math.random() * rows);
  let endRndCol = Math.floor(Math.random() * cols);
  while(endRndCol === startRndCol || nodes[endRndRow][endRndCol].isWall){
   endRndRow = Math.floor(Math.random() * rows);
   endRndCol = Math.floor(Math.random() * cols);
  }

 nodes[startRndRow][startRndCol].divReference.classList.add("node-start");
 startNode = nodes[startRndRow][startRndCol];
 nodes[startRndRow][startRndCol].isStart = true;
 nodes[endRndRow][endRndCol].divReference.classList.add("node-end");
 endNode = nodes[endRndRow][endRndCol];
 nodes[endRndRow][endRndCol].isEnd = true;
}

function clearToasts(){
  let failToastTriggerEl = document.getElementById('fail-toast')
  let failToast = new mdb.Toast(failToastTriggerEl)
  let infoToastTriggerEl = document.getElementById('info-toast')
  let infoToast = new mdb.Toast(infoToastTriggerEl)
  let shortcutToastTriggerEl = document.getElementById('shortcut-toast')
  let shortcutToast = new mdb.Toast(shortcutToastTriggerEl)
  // primToast.hide()
  failToast.hide()
  infoToast.hide()
  shortcutToast.hide()
}
