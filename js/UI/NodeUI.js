import { Vector3 } from 'three'

import { camerasTypes, units } from '../data.js'
import { Node } from '../scene/objects/sensors/Node.js'

class NodeUI{
    constructor(node, sceneManager)
    {
        buildUIDiv();
        bindEventListeners();

        function buildUIDiv()
        {
            const nodeUIdiv = document.createElement('div');
            nodeUIdiv.classList.add("nodeUI");
            
            nodeUIdiv.id = 'node-' + (node.id) + '-UI';
            nodeUIdiv.innerHTML = `
                <div id="node-` + (node.id) + `-UI-header" class="row center-x-spaced center-y">
                    <div class="row center-y">
                        <div class="node-color" style="background-color: #`+ node.color.getHexString() + `;"></div>
                        <p class="main-text">VP ` + (node.id + 1) + `</p>
                    </div>
                    <div class="row center-y">
                        <!-- <div id="node-` + (node.id) + `-solo-button"><span class="iconify" data-icon="bx:search-alt-2"></span></div> -->
                        <div id="node-` + (node.id) + `-hide-UI"><span class="iconify" data-icon="bx:minus"></span></div> 
                        <div id="node-` + (node.id) + `-visible"><span class="iconify" data-icon="akar-icons:eye-open"></span></div>
                        <!-- <div><span class="iconify" data-icon="fluent:lock-open-16-regular"></span></div> -->
                    </div>
                </div>
                <div id="node-infos-` + (node.id) + `-UI" class="column sections-container space-y">
                    <div class="row node-transformations">
                        <p class="main-text">Position</p>
                        <div>
                            <p id="x-pos-`+ node.id +`" class="draggable">X <strong data-unit=` + sceneManager.currentUnit.value + `>` + Math.round(node.xPos * sceneManager.currentUnit.value * 100) /100.0 + `</strong><span data-unittext=` + sceneManager.currentUnit.value + `>` + sceneManager.currentUnit.label +`</span></p>
                        </div>
                        <div>
                            <p id="y-pos-`+ node.id +`" class="draggable">Y <strong data-unit=` + sceneManager.currentUnit.value + `>` + Math.round(-node.zPos * sceneManager.currentUnit.value * 100) /100.0 + `</strong><span data-unittext=` + sceneManager.currentUnit.value + `>` + sceneManager.currentUnit.label +`</span></p>
                        </div>
                        <div>
                            <p id="z-pos-`+ node.id +`" class="draggable">Z <strong data-unit=` + sceneManager.currentUnit.value + `>` + Math.round(node.yPos * sceneManager.currentUnit.value * 100) /100.0 + `</strong><span data-unittext=` + sceneManager.currentUnit.value + `>` + sceneManager.currentUnit.label +`</span></p>
                        </div>
                    </div>
                    <div class="row node-transformations">
                        <p class="main-text">Rotation</p>
                        <div>
                            <p id="x-rot-`+ node.id +`" class="draggable">X <strong>` + Math.round(node.xRot*180/Math.PI) + `</strong>°</p>
                        </div>
                        <div>
                            <p id="y-rot-`+ node.id +`" class="draggable">Y <strong>` + Math.round(node.yRot*180/Math.PI) + `</strong>°</p>
                        </div>
                        <div>
                            <p id="z-rot-`+ node.id +`" class="draggable">Z <strong>` + Math.round(node.zRot*180/Math.PI) + `</strong>° </p>
                        </div>
                    </div>
                </div>`;

            /*
            const sensorDiv = document.getElementById('sensors-infos');
            sensorDiv.appendChild(nodeUIdiv);
            */
            const inpsectorDiv = document.getElementById('inspector');
            inpsectorDiv.appendChild(nodeUIdiv);
        }

        function bindEventListeners()
        {
            
            makeElementDraggable(document.getElementById("x-pos-" + node.id));
            makeElementDraggable(document.getElementById("y-pos-" + node.id));
            makeElementDraggable(document.getElementById("z-pos-" + node.id));
            makeElementDraggable(document.getElementById("x-rot-" + node.id));
            makeElementDraggable(document.getElementById("y-rot-" + node.id));
            makeElementDraggable(document.getElementById("z-rot-" + node.id));
        
    
            document.getElementById('node-' + (node.id) + '-hide-UI').addEventListener('click', () => hideUICam());
            document.getElementById('node-' + (node.id) + '-visible').addEventListener('click', () => changeVisibilityofCam());
        }

        function makeElementDraggable(element) {
            let valueElement = element.getElementsByTagName('strong')[0];
            let value = parseFloat(valueElement.innerHTML);
            let mousePosX = 0;
            let diffX = 0;
            element.onmousedown = dragMouseDown;
            let dragged = false;
        
        
            function dragMouseDown(e) {
                valueElement = element.getElementsByTagName('strong')[0];
                value = parseFloat(valueElement.innerHTML);
                valueElement.classList.add('underlined');
                dragged = false;
                e = e || window.event;
                e.preventDefault();
                // get the mouse cursor position at startup:
                mousePosX = e.clientX;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }
        
            function elementDrag(e) {
                dragged = true;
                e = e || window.event;
                e.preventDefault();
                // calculate the new cursor position:
                diffX = e.clientX - mousePosX;
                mousePosX = e.clientX;
        
                let fac = 1;
                switch(element.id.split('-')[1])
                {
                    case "pos" :
                        fac = 1 / 100.0;
                        break;
                    case "rot":
                        fac = 1;
                        break;
                    default:
                        fac = 1;
                        break;
                }
        
                value += diffX * fac;
                valueElement.innerHTML = Math.round(value*100)/100.0;
        
                switch(element.id.split('-')[0])
                {
                    case "x":
                        switch(element.id.split('-')[1])
                        {
                            case "pos" :
                                node.xPos = value / sceneManager.currentUnit.value;
                                node.cameraPerspective.position.x = node.xPos;
                                node.mesh.position.set( node.xPos, node.yPos, node.zPos );
                                break;
                            case "rot":
                                /*node.cameraPerspective.rotateOnWorldAxis(node.xRotationAxis, value * (Math.PI / 180.0) - node.pitch);*/
                                node.xRot = value * (Math.PI / 180.0);
                                node.cameraPerspective.rotation.x = node.xRot + Node.DEFAULT_NODE_ROTATION_X;
                                break;
                            default:
                                break;
                        }
                        break;
                    case "y":
                        switch(element.id.split('-')[1])
                        {
                            case "pos" :
                                node.zPos = value / sceneManager.currentUnit.value;
                                node.cameraPerspective.position.z = node.zPos;
                                node.mesh.position.set(node.xPos, node.yPos, node.zPos);
                                break;
                            case "rot":
                                /*node.cameraPerspective.rotateOnWorldAxis(new Vector3(0,1,0), value * (Math.PI / 180.0) - node.yaw);
                                node.xRotationAxis.applyAxisAngle(new Vector3(0,1,0), value * (Math.PI / 180.0) - node.yaw);
                                node.xRotationAxis.normalize();
                                node.yaw = value * (Math.PI / 180.0);*/
                                /*
                                const rotateYAxis = new Vector3(0,1,0);
                                rotateYAxis.applyAxisAngle(new Vector3(0,0,- 1), - node.zRot);
                                node.cameraPerspective.rotateOnAxis(rotateYAxis, -(value * (Math.PI / 180.0) - node.yRot));*/
                                node.yRot = value * (Math.PI / 180.0);
                                node.cameraPerspective.rotation.y = - node.yRot;
                                break;
                            default:
                                break;
                        }
                        break;
                    case "z":
                        switch(element.id.split('-')[1])
                        {
                            case "pos" :
                                node.yPos = value / sceneManager.currentUnit.value;
                                node.cameraPerspective.position.y = node.yPos;
                                node.mesh.position.set( node.xPos, node.yPos, node.zPos );
                                break;
                            case "rot":
                                /*const rotateZAxis = new Vector3();
                                node.cameraPerspective.getWorldDirection(rotateZAxis);
                                node.cameraPerspective.rotateOnWorldAxis(rotateZAxis,-(value * (Math.PI / 180.0) - node.zRot));*/
                                node.zRot = value * (Math.PI / 180.0);
                                node.cameraPerspective.rotation.z = node.zRot;
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }
            }
        
            function closeDragElement() {
                if(valueElement.classList.contains('underlined')) valueElement.classList.remove('underlined');
                /* stop changing when mouse button is released:*/
                document.onmouseup = null;
                document.onmousemove = null;
        
                /*on clic, change the value with an input*/
                /* WIP
                if(!dragged)
                {
                    let inputElem = document.createElement('input');
                    inputElem.type = "text";
                    inputElem.setAttribute("autofocus", true);
                    inputElem.name = element.id;
                    inputElem.value = valueElement.innerHTML;
                    inputElem.style = `
                        width: 50px;
                        position: fixed;
                    `;
                    element.insertBefore(inputElem, element.firstChild);
                }*/
            }
        }

        function hideUICam()
        {
            const camInfosUI = document.getElementById('node-infos-' + (node.id) + '-UI');
            const camUIheader = document.getElementById('node-' + (node.id) + '-UI-header');
            const hidden = camInfosUI.classList.contains('hidden');
            hidden ? camInfosUI.classList.remove('hidden') : camInfosUI.classList.add('hidden');
            const iconElem = document.getElementById('node-' + (node.id) + '-hide-UI').firstChild;
            iconElem.dataset.icon = hidden ? "bx:minus" : "bx:plus";
        }

        function changeVisibilityofCam()
        {
            node.changeVisibility();
            sceneManager.objects.updateFrustumIcon();
        }

        this.changeFar = function()
        {
            document.getElementById('far' + node.id).innerHTML = (Math.round(node.cameraPerspective.far*document.getElementById('far' + node.id).dataset.unit * 100) / 100.0);
        }

        this.changeVisibility = function(visible)
        {
            const iconElem = document.getElementById('node-' + (node.id) + '-visible').firstElementChild;
            iconElem.dataset.icon = visible ? "akar-icons:eye-open" : "akar-icons:eye-slashed";
        }

        this.updatePosition = function(x, y, z, currentUnitValue)
        {
            document.getElementById('x-pos-'+ node.id).getElementsByTagName('strong')[0].innerHTML = Math.round(x * currentUnitValue * 100)/100.0;
            document.getElementById('y-pos-'+ node.id).getElementsByTagName('strong')[0].innerHTML = Math.round(z * currentUnitValue * 100)/100.0;
            document.getElementById('z-pos-'+ node.id).getElementsByTagName('strong')[0].innerHTML = Math.round(y * currentUnitValue * 100)/100.0;
        }

        this.dispose = function()
        {
            document.getElementById('node-' + node.id + '-UI').remove();
        }
    }
}

export { NodeUI }
