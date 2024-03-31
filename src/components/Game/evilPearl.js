import {
    TextureLoader,
    MeshBasicMaterial,
    Mesh,
    PlaneGeometry,
    Vector2
} from "three";

const keyboards = {
    "w": 87,
    "s": 83,
    "a": 65,
    "d": 68,
    "izq": 37,
    "der": 39
}

class EvilPearl {
    #textureLoader;
    #texture;
    #material;
    #square;
    #geometry;
    #sprite_width;
    #sprite_height;
    #nameTexture = ['./puyo_blue.png', './puyo_green.png', './puyo_red.png', './puyo_yellow.png'];
    #textureNumber;
    #pos;
    #orderNumber;
    #columnNumber;
    #rowNumber;
    #constantPosition;
    #constantMovement;
    #activateKeyBoard;
    #arrMulti;
    #blockA;
    #blockD;
    #blockArrowRight;
    #blockArrowLeft;
    #stopRef;
    #searchCombosRed;
    #searchCombosBlue;
    #searchCombosGreen;
    #searchCombosYellow;
    #moveDownAfterCombos;

    constructor(textureNumber, orderNumber, arrMulti, activateKeyBoard, position, columnNumber, rowNumber) {
        this.#moveDownAfterCombos = false;
        this.#searchCombosRed = false;
        this.#searchCombosBlue = false;
        this.#searchCombosGreen = false;
        this.#searchCombosYellow = false;
        this.#blockArrowRight = false;
        this.#blockArrowLeft = false;
        this.#stopRef = false;
        this.#blockA = false;
        this.#blockD = false;
        this.#activateKeyBoard = activateKeyBoard;
        this.#arrMulti = arrMulti;
        this.#columnNumber = columnNumber;
        //this.#rowNumber = orderNumber === 1 ? 1 : 0;
        this.#rowNumber = rowNumber;
        this.#constantPosition = 0.100;
        this.#constantMovement = 0.100;
        this.#pos = 0;
        this.#orderNumber = orderNumber;
        this.#sprite_width = 0.1;
        this.#sprite_height = 0.1;
        //const position = this.#orderNumber === 1 ? new Vector3(0, 0.80, 0) : new Vector3(0, 0.90, 0);
        this.#geometry = new PlaneGeometry(this.#sprite_width, this.#sprite_height);
        this.#textureLoader = new TextureLoader();
        this.#texture = this.#textureLoader.load(this.#nameTexture[textureNumber]);
        this.#material = new MeshBasicMaterial({ map: this.#texture, transparent: true });
        this.#square = new Mesh(this.#geometry, this.#material);
        this.#square.position.set(position.x, position.y, position.z);
        this.#textureNumber = textureNumber;
        document.addEventListener("keydown", this.movePearl.bind(this), false);
    }

    getTextureNumber() {
        return this.#textureNumber;
    }

    getPearl() {
        return this.#square;
    }

    getRow() {
        return this.#rowNumber;
    }

    getColumn() {
        return this.#columnNumber;
    }

    getKeyBoardFlag() {
        return this.#activateKeyBoard;
    }

    setKeyBoardFlag(flag) {
        this.#activateKeyBoard = flag;
    }

    setBlockA(blockA) {
        this.#blockA = blockA;
    }

    setBlockD(blockD) {
        this.#blockD = blockD;
    }

    setStopRef(stopRef) {
        this.#stopRef = stopRef;
    }

    setBlockArrowRight(block) {
        this.#blockArrowRight = block;
    }

    setBlockArrowLeft(block) {
        this.#blockArrowLeft = block;
    }

    setPosY(y) {
        this.#square.position.y -= y;
    }

    setRow(y) {
        this.#rowNumber += y;
    }

    setMoveDownAfterCombos(flag) {
        this.#moveDownAfterCombos -= flag;
    }

    getMoveDownAfterCombos() {
        return this.#moveDownAfterCombos;
    }

    detectCombos() {
        console.clear();
        //Repazar arreglo para eliminar combos
        let arrMultiClone = this.#arrMulti;
        let [arrBlue, arrGreen, arrRed, arrYellow, arrBlueAdy, arrGreenAdy, arrRedAdy, arrYellowAdy] = [[], [], [], [], [], [], [], []];
        let finishAdy = [];

        //Guardar Ubicaciones de las perlas si pertenecen a un color
        for (let i = 0; i < 19; i++) {
            for (let j = 0; j < 13; j++) {
                let obj = arrMultiClone[i][j];

                if (obj instanceof EvilPearl) {
                    if (obj.getTextureNumber() === 0)
                        arrBlue.push(new Vector2(j, i));
                    else if (obj.getTextureNumber() === 1)
                        arrGreen.push(new Vector2(j, i));
                    else if (obj.getTextureNumber() === 2)
                        arrRed.push(new Vector2(j, i));
                    else if (obj.getTextureNumber() === 3)
                        arrYellow.push(new Vector2(j, i));
                }
            }
        }

        this.#searchCombosRed = true;
        this.#searchCombosBlue = true;
        this.#searchCombosGreen = true;
        this.#searchCombosYellow = true;
        //Recorrer arreglos de los colores para revisar combos
        while (this.#searchCombosRed || this.#searchCombosBlue || this.#searchCombosGreen || this.#searchCombosYellow) {
            if (arrRed.length >= 1) {
                //Verificar que tenga adyacentes
                let refRightCoord = arrRed[0].x < 12 ? new Vector2(arrRed[0].x + 1, arrRed[0].y) : null;
                let refDownCoord = arrRed[0].y < 18 ? new Vector2(arrRed[0].x, arrRed[0].y + 1) : null;
                let refLeftCoord = arrRed[0].x > 0 ? new Vector2(arrRed[0].x - 1, arrRed[0].y) : null;
                let refUpCoord = arrRed[0].y > 0 ? new Vector2(arrRed[0].x, arrRed[0].y - 1) : null;

                //Checar si los adyacentes existen en los arreglos
                let [existsRight, existsDown, existsLeft, existsUp] = [false, false, false, false]

                if (refRightCoord !== null)
                    arrRed.forEach((e2, i2) => {
                        if (e2.x === refRightCoord.x && e2.y === refRightCoord.y)
                            existsRight = true;
                    });
                if (refDownCoord !== null)
                    arrRed.forEach((e2, i2) => {
                        if (e2.x === refDownCoord.x && e2.y === refDownCoord.y)
                            existsDown = true;

                    });
                if (refLeftCoord !== null)
                    arrRed.forEach((e2, i2) => {
                        if (e2.x === refLeftCoord.x && e2.y === refLeftCoord.y)
                            existsLeft = true;
                    });
                if (refUpCoord !== null)
                    arrRed.forEach((e2, i2) => {
                        if (e2.x === refUpCoord.x && e2.y === refUpCoord.y)
                            existsUp = true;
                    });

                //Si tiene al menos un adyacente el el obj
                if (existsRight || existsDown || existsLeft || existsUp) {
                    //Red push
                    arrRedAdy.push(arrRed[0]);
                    arrRed[0] = null;

                    //Quitar nulos del arreglo Rojo
                    for (let i = arrRed.length - 1; i >= 0; i--) {
                        if (arrRed[i] === null) {
                            arrRed.splice(i, 1);
                        }
                    }

                    //Recorrido de los bloques  para encontrar adyacentes a los bloques
                    for (let x = 0; x < arrRedAdy.length; x++) {
                        let refRightCoord2 = arrRedAdy[x].x < 12 ? new Vector2(arrRedAdy[x].x + 1, arrRedAdy[x].y) : null;
                        let refDownCoord2 = arrRedAdy[x].y < 18 ? new Vector2(arrRedAdy[x].x, arrRedAdy[x].y + 1) : null;
                        let refLeftCoord2 = arrRedAdy[x].x > 0 ? new Vector2(arrRedAdy[x].x - 1, arrRedAdy[x].y) : null;
                        let refUpCoord2 = arrRedAdy[x].y > 0 ? new Vector2(arrRedAdy[x].x, arrRedAdy[x].y - 1) : null;

                        let [existsRight2, existsDown2, existsLeft2, existsUp2, existsRightAdy2, existsDownAdy2, existsLeftAdy2, existsUpAdy2] = [false, false, false, false, false, false, false, false]

                        //Checar si los adyacentes existen en los arreglos
                        if (refRightCoord2 !== null) {
                            arrRed.forEach((e2, i2) => {
                                if (e2.x === refRightCoord2.x && e2.y === refRightCoord2.y)
                                    existsRight2 = true;
                            });

                            arrRedAdy.forEach((e2, i2) => {
                                if (e2.x === refRightCoord2.x && e2.y === refRightCoord2.y)
                                    existsRightAdy2 = true;
                            });
                        }
                        if (refDownCoord2 !== null) {
                            arrRed.forEach((e2, i2) => {
                                if (e2.x === refDownCoord2.x && e2.y === refDownCoord2.y)
                                    existsDown2 = true;
                            });

                            arrRedAdy.forEach((e2, i2) => {
                                if (e2.x === refDownCoord2.x && e2.y === refDownCoord2.y)
                                    existsDownAdy2 = true;
                            });
                        }
                        if (refLeftCoord2 !== null) {
                            arrRed.forEach((e2, i2) => {
                                if (e2.x === refLeftCoord2.x && e2.y === refLeftCoord2.y)
                                    existsLeft2 = true;
                            });

                            arrRedAdy.forEach((e2, i2) => {
                                if (e2.x === refLeftCoord2.x && e2.y === refLeftCoord2.y)
                                    existsLeftAdy2 = true;
                            });
                        }
                        if (refUpCoord2 !== null) {
                            arrRed.forEach((e2, i2) => {
                                if (e2.x === refUpCoord2.x && e2.y === refUpCoord2.y)
                                    existsUp2 = true;
                            });

                            arrRedAdy.forEach((e2, i2) => {
                                if (e2.x === refUpCoord2.x && e2.y === refUpCoord2.y)
                                    existsUpAdy2 = true;
                            });
                        }

                        if (existsRight2 && !existsRightAdy2) {
                            arrRedAdy.push(refRightCoord2);
                            //Eliminar
                            arrRed.forEach((e2, i2) => {
                                if (e2.x === refRightCoord2.x && e2.y === refRightCoord2.y)
                                    arrRed[i2] = null;
                            });

                            //Quitar nulos del arreglo
                            for (let i = arrRed.length - 1; i >= 0; i--) {
                                if (arrRed[i] === null) {
                                    arrRed.splice(i, 1);
                                }
                            }
                        }
                        if (existsDown2 && !existsDownAdy2) {
                            arrRedAdy.push(refDownCoord2);
                            //Eliminar
                            arrRed.forEach((e2, i2) => {
                                if (e2.x === refDownCoord2.x && e2.y === refDownCoord2.y)
                                    arrRed[i2] = null;
                            });

                            //Quitar nulos del arreglo
                            for (let i = arrRed.length - 1; i >= 0; i--) {
                                if (arrRed[i] === null) {
                                    arrRed.splice(i, 1);
                                }
                            }
                        }
                        if (existsLeft2 && !existsLeftAdy2) {
                            arrRedAdy.push(refLeftCoord2);

                            //Eliminar
                            arrRed.forEach((e2, i2) => {
                                if (e2.x === refLeftCoord2.x && e2.y === refLeftCoord2.y)
                                    arrRed[i2] = null;
                            });

                            //Quitar nulos del arreglo
                            for (let i = arrRed.length - 1; i >= 0; i--) {
                                if (arrRed[i] === null) {
                                    arrRed.splice(i, 1);
                                }
                            }
                        }
                        if (existsUp2 && !existsUpAdy2) {
                            arrRedAdy.push(refUpCoord2);

                            //Eliminar
                            arrRed.forEach((e2, i2) => {
                                if (e2.x === refUpCoord2.x && e2.y === refUpCoord2.y)
                                    arrRed[i2] = null;
                            });

                            //Quitar nulos del arreglo
                            for (let i = arrRed.length - 1; i >= 0; i--) {
                                if (arrRed[i] === null) {
                                    arrRed.splice(i, 1);
                                }
                            }
                        }
                    };

                    //Logica para eliminar bloques
                    //Regresar vectores para eliminar los objetos
                    if (arrRedAdy.length >= 4)
                        finishAdy.push(arrRedAdy);

                    arrRedAdy = [];
                }
                else {
                    //Eliminar del arreglo original
                    arrRed[0] = null;

                    //Quitar nulos del arreglo
                    for (let i = arrRed.length - 1; i >= 0; i--) {
                        if (arrRed[i] === null)
                            arrRed.splice(i, 1);
                    }
                }

            }
            else {
                //Terminar el proceso cuando ya no tenga mas de cuatro el arreglo
                this.#searchCombosRed = false;
                arrRed = [];
            }
            if (arrBlue.length >= 1) {
                //Verificar que tenga adyacentes
                let refRightCoord = arrBlue[0].x < 12 ? new Vector2(arrBlue[0].x + 1, arrBlue[0].y) : null;
                let refDownCoord = arrBlue[0].y < 18 ? new Vector2(arrBlue[0].x, arrBlue[0].y + 1) : null;
                let refLeftCoord = arrBlue[0].x > 0 ? new Vector2(arrBlue[0].x - 1, arrBlue[0].y) : null;
                let refUpCoord = arrBlue[0].y > 0 ? new Vector2(arrBlue[0].x, arrBlue[0].y - 1) : null;

                //Checar si los adyacentes existen en los arreglos
                let [existsRight, existsDown, existsLeft, existsUp] = [false, false, false, false]

                if (refRightCoord !== null)
                    arrBlue.forEach((e2, i2) => {
                        if (e2.x === refRightCoord.x && e2.y === refRightCoord.y)
                            existsRight = true;
                    });
                if (refDownCoord !== null)
                    arrBlue.forEach((e2, i2) => {
                        if (e2.x === refDownCoord.x && e2.y === refDownCoord.y)
                            existsDown = true;

                    });
                if (refLeftCoord !== null)
                    arrBlue.forEach((e2, i2) => {
                        if (e2.x === refLeftCoord.x && e2.y === refLeftCoord.y)
                            existsLeft = true;
                    });
                if (refUpCoord !== null)
                    arrBlue.forEach((e2, i2) => {
                        if (e2.x === refUpCoord.x && e2.y === refUpCoord.y)
                            existsUp = true;
                    });

                //Si tiene al menos un adyacente el el obj
                if (existsRight || existsDown || existsLeft || existsUp) {
                    //Red push
                    arrBlueAdy.push(arrBlue[0]);
                    arrBlue[0] = null;

                    //Quitar nulos del arreglo Rojo
                    for (let i = arrBlue.length - 1; i >= 0; i--) {
                        if (arrBlue[i] === null) {
                            arrBlue.splice(i, 1);
                        }
                    }

                    //Recorrido de los bloques  para encontrar adyacentes a los bloques
                    for (let x = 0; x < arrBlueAdy.length; x++) {
                        let refRightCoord2 = arrBlueAdy[x].x < 12 ? new Vector2(arrBlueAdy[x].x + 1, arrBlueAdy[x].y) : null;
                        let refDownCoord2 = arrBlueAdy[x].y < 18 ? new Vector2(arrBlueAdy[x].x, arrBlueAdy[x].y + 1) : null;
                        let refLeftCoord2 = arrBlueAdy[x].x > 0 ? new Vector2(arrBlueAdy[x].x - 1, arrBlueAdy[x].y) : null;
                        let refUpCoord2 = arrBlueAdy[x].y > 0 ? new Vector2(arrBlueAdy[x].x, arrBlueAdy[x].y - 1) : null;

                        let [existsRight2, existsDown2, existsLeft2, existsUp2, existsRightAdy2, existsDownAdy2, existsLeftAdy2, existsUpAdy2] = [false, false, false, false, false, false, false, false]

                        //Checar si los adyacentes existen en los arreglos
                        if (refRightCoord2 !== null) {
                            arrBlue.forEach((e2, i2) => {
                                if (e2.x === refRightCoord2.x && e2.y === refRightCoord2.y)
                                    existsRight2 = true;
                            });

                            arrBlueAdy.forEach((e2, i2) => {
                                if (e2.x === refRightCoord2.x && e2.y === refRightCoord2.y)
                                    existsRightAdy2 = true;
                            });
                        }
                        if (refDownCoord2 !== null) {
                            arrBlue.forEach((e2, i2) => {
                                if (e2.x === refDownCoord2.x && e2.y === refDownCoord2.y)
                                    existsDown2 = true;
                            });

                            arrBlueAdy.forEach((e2, i2) => {
                                if (e2.x === refDownCoord2.x && e2.y === refDownCoord2.y)
                                    existsDownAdy2 = true;
                            });
                        }
                        if (refLeftCoord2 !== null) {
                            arrBlue.forEach((e2, i2) => {
                                if (e2.x === refLeftCoord2.x && e2.y === refLeftCoord2.y)
                                    existsLeft2 = true;
                            });

                            arrBlueAdy.forEach((e2, i2) => {
                                if (e2.x === refLeftCoord2.x && e2.y === refLeftCoord2.y)
                                    existsLeftAdy2 = true;
                            });
                        }
                        if (refUpCoord2 !== null) {
                            arrBlue.forEach((e2, i2) => {
                                if (e2.x === refUpCoord2.x && e2.y === refUpCoord2.y)
                                    existsUp2 = true;
                            });

                            arrBlueAdy.forEach((e2, i2) => {
                                if (e2.x === refUpCoord2.x && e2.y === refUpCoord2.y)
                                    existsUpAdy2 = true;
                            });
                        }

                        if (existsRight2 && !existsRightAdy2) {
                            arrBlueAdy.push(refRightCoord2);
                            //Eliminar
                            arrBlue.forEach((e2, i2) => {
                                if (e2.x === refRightCoord2.x && e2.y === refRightCoord2.y)
                                    arrBlue[i2] = null;
                            });

                            //Quitar nulos del arreglo
                            for (let i = arrBlue.length - 1; i >= 0; i--) {
                                if (arrBlue[i] === null) {
                                    arrBlue.splice(i, 1);
                                }
                            }
                        }
                        if (existsDown2 && !existsDownAdy2) {
                            arrBlueAdy.push(refDownCoord2);
                            //Eliminar
                            arrBlue.forEach((e2, i2) => {
                                if (e2.x === refDownCoord2.x && e2.y === refDownCoord2.y)
                                    arrBlue[i2] = null;
                            });

                            //Quitar nulos del arreglo
                            for (let i = arrBlue.length - 1; i >= 0; i--) {
                                if (arrBlue[i] === null) {
                                    arrBlue.splice(i, 1);
                                }
                            }
                        }
                        if (existsLeft2 && !existsLeftAdy2) {
                            arrBlueAdy.push(refLeftCoord2);

                            //Eliminar
                            arrBlue.forEach((e2, i2) => {
                                if (e2.x === refLeftCoord2.x && e2.y === refLeftCoord2.y)
                                    arrBlue[i2] = null;
                            });

                            //Quitar nulos del arreglo
                            for (let i = arrBlue.length - 1; i >= 0; i--) {
                                if (arrBlue[i] === null) {
                                    arrBlue.splice(i, 1);
                                }
                            }
                        }
                        if (existsUp2 && !existsUpAdy2) {
                            arrBlueAdy.push(refUpCoord2);

                            //Eliminar
                            arrBlue.forEach((e2, i2) => {
                                if (e2.x === refUpCoord2.x && e2.y === refUpCoord2.y)
                                    arrBlue[i2] = null;
                            });

                            //Quitar nulos del arreglo
                            for (let i = arrBlue.length - 1; i >= 0; i--) {
                                if (arrBlue[i] === null) {
                                    arrBlue.splice(i, 1);
                                }
                            }
                        }
                    };

                    //Logica para eliminar bloques
                    //Regresar vectores para eliminar los objetos

                    if (arrBlueAdy.length >= 4)
                        finishAdy.push(arrBlueAdy);

                    arrBlue = [];

                }
                else {
                    //Eliminar del arreglo original
                    arrBlue[0] = null;

                    //Quitar nulos del arreglo
                    for (let i = arrBlue.length - 1; i >= 0; i--) {
                        if (arrBlue[i] === null)
                            arrBlue.splice(i, 1);
                    }
                }

            }
            else {
                //Terminar el proceso cuando ya no tenga mas de cuatro el arreglo
                this.#searchCombosBlue = false;
                arrBlue = [];
            }
            if (arrGreen.length >= 1) {
                //Verificar que tenga adyacentes
                let refRightCoord = arrGreen[0].x < 12 ? new Vector2(arrGreen[0].x + 1, arrGreen[0].y) : null;
                let refDownCoord = arrGreen[0].y < 18 ? new Vector2(arrGreen[0].x, arrGreen[0].y + 1) : null;
                let refLeftCoord = arrGreen[0].x > 0 ? new Vector2(arrGreen[0].x - 1, arrGreen[0].y) : null;
                let refUpCoord = arrGreen[0].y > 0 ? new Vector2(arrGreen[0].x, arrGreen[0].y - 1) : null;

                //Checar si los adyacentes existen en los arreglos
                let [existsRight, existsDown, existsLeft, existsUp] = [false, false, false, false]

                if (refRightCoord !== null)
                    arrGreen.forEach((e2, i2) => {
                        if (e2.x === refRightCoord.x && e2.y === refRightCoord.y)
                            existsRight = true;
                    });
                if (refDownCoord !== null)
                    arrGreen.forEach((e2, i2) => {
                        if (e2.x === refDownCoord.x && e2.y === refDownCoord.y)
                            existsDown = true;

                    });
                if (refLeftCoord !== null)
                    arrGreen.forEach((e2, i2) => {
                        if (e2.x === refLeftCoord.x && e2.y === refLeftCoord.y)
                            existsLeft = true;
                    });
                if (refUpCoord !== null)
                    arrGreen.forEach((e2, i2) => {
                        if (e2.x === refUpCoord.x && e2.y === refUpCoord.y)
                            existsUp = true;
                    });

                //Si tiene al menos un adyacente el el obj
                if (existsRight || existsDown || existsLeft || existsUp) {
                    //Red push
                    arrGreenAdy.push(arrGreen[0]);
                    arrGreen[0] = null;

                    //Quitar nulos del arreglo Rojo
                    for (let i = arrGreen.length - 1; i >= 0; i--) {
                        if (arrGreen[i] === null) {
                            arrGreen.splice(i, 1);
                        }
                    }

                    //Recorrido de los bloques  para encontrar adyacentes a los bloques
                    for (let x = 0; x < arrGreenAdy.length; x++) {
                        let refRightCoord2 = arrGreenAdy[x].x < 12 ? new Vector2(arrGreenAdy[x].x + 1, arrGreenAdy[x].y) : null;
                        let refDownCoord2 = arrGreenAdy[x].y < 18 ? new Vector2(arrGreenAdy[x].x, arrGreenAdy[x].y + 1) : null;
                        let refLeftCoord2 = arrGreenAdy[x].x > 0 ? new Vector2(arrGreenAdy[x].x - 1, arrGreenAdy[x].y) : null;
                        let refUpCoord2 = arrGreenAdy[x].y > 0 ? new Vector2(arrGreenAdy[x].x, arrGreenAdy[x].y - 1) : null;

                        let [existsRight2, existsDown2, existsLeft2, existsUp2, existsRightAdy2, existsDownAdy2, existsLeftAdy2, existsUpAdy2] = [false, false, false, false, false, false, false, false]

                        //Checar si los adyacentes existen en los arreglos
                        if (refRightCoord2 !== null) {
                            arrGreen.forEach((e2, i2) => {
                                if (e2.x === refRightCoord2.x && e2.y === refRightCoord2.y)
                                    existsRight2 = true;
                            });

                            arrGreenAdy.forEach((e2, i2) => {
                                if (e2.x === refRightCoord2.x && e2.y === refRightCoord2.y)
                                    existsRightAdy2 = true;
                            });
                        }
                        if (refDownCoord2 !== null) {
                            arrGreen.forEach((e2, i2) => {
                                if (e2.x === refDownCoord2.x && e2.y === refDownCoord2.y)
                                    existsDown2 = true;
                            });

                            arrGreenAdy.forEach((e2, i2) => {
                                if (e2.x === refDownCoord2.x && e2.y === refDownCoord2.y)
                                    existsDownAdy2 = true;
                            });
                        }
                        if (refLeftCoord2 !== null) {
                            arrGreen.forEach((e2, i2) => {
                                if (e2.x === refLeftCoord2.x && e2.y === refLeftCoord2.y)
                                    existsLeft2 = true;
                            });

                            arrGreenAdy.forEach((e2, i2) => {
                                if (e2.x === refLeftCoord2.x && e2.y === refLeftCoord2.y)
                                    existsLeftAdy2 = true;
                            });
                        }
                        if (refUpCoord2 !== null) {
                            arrGreen.forEach((e2, i2) => {
                                if (e2.x === refUpCoord2.x && e2.y === refUpCoord2.y)
                                    existsUp2 = true;
                            });

                            arrGreenAdy.forEach((e2, i2) => {
                                if (e2.x === refUpCoord2.x && e2.y === refUpCoord2.y)
                                    existsUpAdy2 = true;
                            });
                        }

                        if (existsRight2 && !existsRightAdy2) {
                            arrGreenAdy.push(refRightCoord2);
                            //Eliminar
                            arrGreen.forEach((e2, i2) => {
                                if (e2.x === refRightCoord2.x && e2.y === refRightCoord2.y)
                                    arrGreen[i2] = null;
                            });

                            //Quitar nulos del arreglo
                            for (let i = arrGreen.length - 1; i >= 0; i--) {
                                if (arrGreen[i] === null) {
                                    arrGreen.splice(i, 1);
                                }
                            }
                        }
                        if (existsDown2 && !existsDownAdy2) {
                            arrGreenAdy.push(refDownCoord2);
                            //Eliminar
                            arrGreen.forEach((e2, i2) => {
                                if (e2.x === refDownCoord2.x && e2.y === refDownCoord2.y)
                                    arrGreen[i2] = null;
                            });

                            //Quitar nulos del arreglo
                            for (let i = arrGreen.length - 1; i >= 0; i--) {
                                if (arrGreen[i] === null) {
                                    arrGreen.splice(i, 1);
                                }
                            }
                        }
                        if (existsLeft2 && !existsLeftAdy2) {
                            arrGreenAdy.push(refLeftCoord2);

                            //Eliminar
                            arrGreen.forEach((e2, i2) => {
                                if (e2.x === refLeftCoord2.x && e2.y === refLeftCoord2.y)
                                    arrGreen[i2] = null;
                            });

                            //Quitar nulos del arreglo
                            for (let i = arrGreen.length - 1; i >= 0; i--) {
                                if (arrGreen[i] === null) {
                                    arrGreen.splice(i, 1);
                                }
                            }
                        }
                        if (existsUp2 && !existsUpAdy2) {
                            arrGreenAdy.push(refUpCoord2);

                            //Eliminar
                            arrGreen.forEach((e2, i2) => {
                                if (e2.x === refUpCoord2.x && e2.y === refUpCoord2.y)
                                    arrGreen[i2] = null;
                            });

                            //Quitar nulos del arreglo
                            for (let i = arrGreen.length - 1; i >= 0; i--) {
                                if (arrGreen[i] === null) {
                                    arrGreen.splice(i, 1);
                                }
                            }
                        }
                    };

                    //Logica para eliminar bloques
                    //Regresar vectores para eliminar los objetos
                    if (arrGreenAdy.length >= 4)
                        finishAdy.push(arrGreenAdy);
                    arrGreen = [];

                }
                else {
                    //Eliminar del arreglo original
                    arrGreen[0] = null;

                    //Quitar nulos del arreglo
                    for (let i = arrGreen.length - 1; i >= 0; i--) {
                        if (arrGreen[i] === null)
                            arrGreen.splice(i, 1);
                    }
                }

            }
            else {
                //Terminar el proceso cuando ya no tenga mas de cuatro el arreglo
                this.#searchCombosGreen = false;
                arrGreen = [];
            }
            if (arrYellow.length >= 1) {
                //Verificar que tenga adyacentes
                let refRightCoord = arrYellow[0].x < 12 ? new Vector2(arrYellow[0].x + 1, arrYellow[0].y) : null;
                let refDownCoord = arrYellow[0].y < 18 ? new Vector2(arrYellow[0].x, arrYellow[0].y + 1) : null;
                let refLeftCoord = arrYellow[0].x > 0 ? new Vector2(arrYellow[0].x - 1, arrYellow[0].y) : null;
                let refUpCoord = arrYellow[0].y > 0 ? new Vector2(arrYellow[0].x, arrYellow[0].y - 1) : null;

                //Checar si los adyacentes existen en los arreglos
                let [existsRight, existsDown, existsLeft, existsUp] = [false, false, false, false]

                if (refRightCoord !== null)
                    arrYellow.forEach((e2, i2) => {
                        if (e2.x === refRightCoord.x && e2.y === refRightCoord.y)
                            existsRight = true;
                    });
                if (refDownCoord !== null)
                    arrYellow.forEach((e2, i2) => {
                        if (e2.x === refDownCoord.x && e2.y === refDownCoord.y)
                            existsDown = true;

                    });
                if (refLeftCoord !== null)
                    arrYellow.forEach((e2, i2) => {
                        if (e2.x === refLeftCoord.x && e2.y === refLeftCoord.y)
                            existsLeft = true;
                    });
                if (refUpCoord !== null)
                    arrYellow.forEach((e2, i2) => {
                        if (e2.x === refUpCoord.x && e2.y === refUpCoord.y)
                            existsUp = true;
                    });

                //Si tiene al menos un adyacente el el obj
                if (existsRight || existsDown || existsLeft || existsUp) {
                    //Red push
                    arrYellowAdy.push(arrYellow[0]);
                    arrYellow[0] = null;

                    //Quitar nulos del arreglo Rojo
                    for (let i = arrYellow.length - 1; i >= 0; i--) {
                        if (arrYellow[i] === null) {
                            arrYellow.splice(i, 1);
                        }
                    }

                    //Recorrido de los bloques  para encontrar adyacentes a los bloques
                    for (let x = 0; x < arrYellowAdy.length; x++) {
                        let refRightCoord2 = arrYellowAdy[x].x < 12 ? new Vector2(arrYellowAdy[x].x + 1, arrYellowAdy[x].y) : null;
                        let refDownCoord2 = arrYellowAdy[x].y < 18 ? new Vector2(arrYellowAdy[x].x, arrYellowAdy[x].y + 1) : null;
                        let refLeftCoord2 = arrYellowAdy[x].x > 0 ? new Vector2(arrYellowAdy[x].x - 1, arrYellowAdy[x].y) : null;
                        let refUpCoord2 = arrYellowAdy[x].y > 0 ? new Vector2(arrYellowAdy[x].x, arrYellowAdy[x].y - 1) : null;

                        let [existsRight2, existsDown2, existsLeft2, existsUp2, existsRightAdy2, existsDownAdy2, existsLeftAdy2, existsUpAdy2] = [false, false, false, false, false, false, false, false]

                        //Checar si los adyacentes existen en los arreglos
                        if (refRightCoord2 !== null) {
                            arrYellow.forEach((e2, i2) => {
                                if (e2.x === refRightCoord2.x && e2.y === refRightCoord2.y)
                                    existsRight2 = true;
                            });

                            arrYellowAdy.forEach((e2, i2) => {
                                if (e2.x === refRightCoord2.x && e2.y === refRightCoord2.y)
                                    existsRightAdy2 = true;
                            });
                        }
                        if (refDownCoord2 !== null) {
                            arrYellow.forEach((e2, i2) => {
                                if (e2.x === refDownCoord2.x && e2.y === refDownCoord2.y)
                                    existsDown2 = true;
                            });

                            arrYellowAdy.forEach((e2, i2) => {
                                if (e2.x === refDownCoord2.x && e2.y === refDownCoord2.y)
                                    existsDownAdy2 = true;
                            });
                        }
                        if (refLeftCoord2 !== null) {
                            arrYellow.forEach((e2, i2) => {
                                if (e2.x === refLeftCoord2.x && e2.y === refLeftCoord2.y)
                                    existsLeft2 = true;
                            });

                            arrYellowAdy.forEach((e2, i2) => {
                                if (e2.x === refLeftCoord2.x && e2.y === refLeftCoord2.y)
                                    existsLeftAdy2 = true;
                            });
                        }
                        if (refUpCoord2 !== null) {
                            arrYellow.forEach((e2, i2) => {
                                if (e2.x === refUpCoord2.x && e2.y === refUpCoord2.y)
                                    existsUp2 = true;
                            });

                            arrYellowAdy.forEach((e2, i2) => {
                                if (e2.x === refUpCoord2.x && e2.y === refUpCoord2.y)
                                    existsUpAdy2 = true;
                            });
                        }

                        if (existsRight2 && !existsRightAdy2) {
                            arrYellowAdy.push(refRightCoord2);
                            //Eliminar
                            arrYellow.forEach((e2, i2) => {
                                if (e2.x === refRightCoord2.x && e2.y === refRightCoord2.y)
                                    arrYellow[i2] = null;
                            });

                            //Quitar nulos del arreglo
                            for (let i = arrYellow.length - 1; i >= 0; i--) {
                                if (arrYellow[i] === null) {
                                    arrYellow.splice(i, 1);
                                }
                            }
                        }
                        if (existsDown2 && !existsDownAdy2) {
                            arrYellowAdy.push(refDownCoord2);
                            //Eliminar
                            arrYellow.forEach((e2, i2) => {
                                if (e2.x === refDownCoord2.x && e2.y === refDownCoord2.y)
                                    arrYellow[i2] = null;
                            });

                            //Quitar nulos del arreglo
                            for (let i = arrYellow.length - 1; i >= 0; i--) {
                                if (arrYellow[i] === null) {
                                    arrYellow.splice(i, 1);
                                }
                            }
                        }
                        if (existsLeft2 && !existsLeftAdy2) {
                            arrYellowAdy.push(refLeftCoord2);

                            //Eliminar
                            arrYellow.forEach((e2, i2) => {
                                if (e2.x === refLeftCoord2.x && e2.y === refLeftCoord2.y)
                                    arrYellow[i2] = null;
                            });

                            //Quitar nulos del arreglo
                            for (let i = arrYellow.length - 1; i >= 0; i--) {
                                if (arrYellow[i] === null) {
                                    arrYellow.splice(i, 1);
                                }
                            }
                        }
                        if (existsUp2 && !existsUpAdy2) {
                            arrYellowAdy.push(refUpCoord2);

                            //Eliminar
                            arrYellow.forEach((e2, i2) => {
                                if (e2.x === refUpCoord2.x && e2.y === refUpCoord2.y)
                                    arrYellow[i2] = null;
                            });

                            //Quitar nulos del arreglo
                            for (let i = arrYellow.length - 1; i >= 0; i--) {
                                if (arrYellow[i] === null) {
                                    arrYellow.splice(i, 1);
                                }
                            }
                        }
                    };

                    //Logica para eliminar bloques
                    //Regresar vectores para eliminar los objetos
                    if (arrYellowAdy.length >= 4)
                        finishAdy.push(arrYellowAdy);
                    arrYellow = [];

                }
                else {
                    //Eliminar del arreglo original
                    arrYellow[0] = null;

                    //Quitar nulos del arreglo
                    for (let i = arrYellow.length - 1; i >= 0; i--) {
                        if (arrYellow[i] === null)
                            arrYellow.splice(i, 1);
                    }
                }

            }
            else {
                //Terminar el proceso cuando ya no tenga mas de cuatro el arreglo
                this.#searchCombosYellow = false;
                arrYellow = [];
            }
        }

        if (finishAdy.length > 0)
            return finishAdy;
        else
            return [];
    }

    movePearl = async (event) => {
        var keyCode = event.which;
        if (this.#activateKeyBoard && !this.#moveDownAfterCombos) {//Si no hay ninguno en movimiento
            if (keyCode === keyboards.a) {
                if (!this.#blockA) {
                    if ((this.#columnNumber > 1 && this.#pos === 1 && this.#orderNumber === 1) || (this.#columnNumber > 0 && this.#pos === 1 && this.#orderNumber === 2) ||
                        (this.#columnNumber > 0 && this.#pos === 3 && this.#orderNumber === 1) || (this.#columnNumber > 1 && this.#pos === 3 && this.#orderNumber === 2) ||
                        (this.#columnNumber > 0 && (this.#pos === 0 || this.#pos === 2))) {
                        //Avanzar a la izquierda si cumple las condiciones
                        this.#square.position.x -= this.#constantMovement;
                        if (this.#pos === 0 && this.#orderNumber === 1) {
                            //Acomoda los objetos al siguiente lugar
                            let objRefAux1 = this.#arrMulti[this.#rowNumber][this.#columnNumber];
                            let objRefAux2 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = null;
                            this.#arrMulti[this.#rowNumber - 1][this.#columnNumber] = null;
                            this.#columnNumber--;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux1;
                            this.#arrMulti[this.#rowNumber - 1][this.#columnNumber] = objRefAux2;
                        }
                        else if (this.#pos === 0 && this.#orderNumber === 2) {
                            this.#columnNumber--;
                            let refObj1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber]; //Obtener la perla 1
                            let nextValue2 = null;
                            let nextValue1 = null;

                            let nextValueRight1 = null;
                            let nextValueRight2 = null;

                            if (refObj1.getColumn() > 0) { // Si la perla 1 no esta al inicio de la izquierda
                                //Obtener dos valores pegados a la izquierda
                                nextValue2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];
                                nextValue1 = this.#arrMulti[this.#rowNumber + 1][refObj1.getColumn() - 1];
                                nextValueRight2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];
                                nextValueRight1 = this.#arrMulti[this.#rowNumber + 1][refObj1.getColumn() + 1];
                            }
                            //Reestablecer valores 
                            if (nextValueRight1 == null && nextValueRight2 === null) {
                                this.#blockD = false;
                                refObj1.setBlockD(false);
                                this.#blockArrowRight = false;
                                refObj1.setBlockArrowRight(false);
                            }
                            if (this.#pos === 0 && (nextValue2 !== null || nextValue1 !== null)) {//Si cualquiera de los nextvalue existe entra
                                if (nextValue1 !== null) { // Si el nextvalue de la perla1 existe entra
                                    if (!nextValue1.getKeyBoardFlag()) {//Si el nextvalue de la perla 1 tiene bloqueado el teclado entra
                                        //Bloquear tecla a
                                        this.#blockA = true;
                                        refObj1.setBlockA(true);
                                        this.#blockArrowLeft = true;
                                        refObj1.setBlockArrowLeft(true);
                                    }
                                }
                                else if (nextValue2 !== null)//Si el next value de la perla 2 existe entra
                                    if (!nextValue2.getKeyBoardFlag()) {//Si el next value de la perla 2 tiene el teclado bloqueado entra
                                        this.#blockA = true; //Bloquear tecla a
                                        refObj1.setBlockA(true);
                                        this.#blockArrowLeft = true;
                                        refObj1.setBlockArrowLeft(true);
                                    }
                            }
                            else {
                                //Detectar objeto de abajo
                                let refObj1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber]; //Obtiene perla 1

                                if (refObj1.getRow() < 18) {
                                    let downValue2 = this.#arrMulti[refObj1.getRow() + 1][this.#columnNumber]; //Obtener Objeto de la perla 1

                                    if (downValue2 !== null) {
                                        this.#blockA = true;
                                        this.#blockD = true;
                                        refObj1.setBlockA(true);
                                        refObj1.setBlockD(true);
                                        this.#activateKeyBoard = false;
                                        refObj1.setKeyBoardFlag(false);
                                    }
                                }


                            }
                        }
                        else if (this.#pos === 1 && this.#orderNumber === 1) {
                            let objRefAux1 = this.#arrMulti[this.#rowNumber][this.#columnNumber];
                            let objRefAux2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = null;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber - 1] = null; // asignar null al antiguo espacio
                            this.#columnNumber--;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux1;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber - 1] = objRefAux2;
                        }
                        else if (this.#pos === 1 && this.#orderNumber === 2) {
                            this.#columnNumber--;
                            let refObj1 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];//Obtener Perla 1
                            //Detectar objetos a la izquierda de la perlas
                            let nextValue2 = null;
                            let nextValue1 = null;
                            let nextValueRight1 = null;
                            if (this.#columnNumber > 0) {//Si la perla 2 esta fuera del limite de la perd izquierda
                                nextValue2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];//Obtener valor de la izquiera de la perla 2
                                nextValue1 = this.#arrMulti[this.#rowNumber][this.#columnNumber];//Obtener valor de la izquierda de la perla 1
                                nextValueRight1 = this.#arrMulti[this.#rowNumber][refObj1.getColumn() + 1]
                            }
                            if (nextValueRight1 === null) {
                                this.#blockD = false;//Bloquear tecla d
                                refObj1.setBlockD(false);//Bloquear tecla d
                            }
                            if ((this.#pos === 1 && nextValue2 !== null && nextValue1 !== null)) {//Si ambias perlas tienen informacion a la izquierda
                                if (!nextValue2.getKeyBoardFlag()) {
                                    this.#blockA = true;//Bloquear tecla a
                                    refObj1.setBlockA(true);//Bloquear tecla a
                                }
                            }
                            //Obtener objetos de arriba de las perlas
                            let upValue1 = null; //Obtener Objeto de la perla 1
                            let upValue2 = null; //Obtener Objeto de la perla 2
                            if (this.#rowNumber > 0) {
                                upValue1 = this.#arrMulti[refObj1.getRow() - 1][refObj1.getColumn()];//Obtener Objeto de la perla 1
                                upValue2 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];//Obtener Objeto de la perla 2
                            }
                            //Desbloquear flecha derecha
                            if (upValue1 === null && upValue2 === null) {
                                this.#blockArrowRight = false;
                                refObj1.setBlockArrowRight(false);
                            }
                            if (this.#pos === 1 && (upValue1 !== null || upValue2 !== null)) {
                                //Si encuentra una perla debajo de la Perla1 bloquea izquierda y derecha de ambas perlas y bloquea teclado de la perla 1...
                                this.#blockArrowRight = true;
                                refObj1.setBlockArrowRight(true);
                            }



                            //Obtener objetos de abajo de las perlas
                            let downValue1 = null; //Obtener Objeto de la perla 1
                            let downValue2 = null; //Obtener Objeto de la perla 2
                            if (this.#rowNumber < 18) {
                                downValue1 = this.#arrMulti[refObj1.getRow() + 1][refObj1.getColumn()];//Obtener Objeto abajo de la perla1
                                downValue2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];//Obtener Objeto abajo de la perla 2
                            }
                            if (this.#pos === 1 && (downValue1 !== null || downValue2 !== null)) {
                                //Si se encuentra una perla debajo de la perla 1..
                                if (downValue1 !== null) {
                                    this.#blockA = true;
                                    this.#blockD = true;
                                    refObj1.setBlockA(true);
                                    refObj1.setBlockD(true);
                                    refObj1.setKeyBoardFlag(false);
                                    this.#stopRef = true;//Informar a la perla 2 que la perla 1 colisiono
                                    this.#blockArrowLeft = true;
                                    this.#blockArrowRight = true;
                                    refObj1.setBlockArrowLeft(true);
                                    refObj1.setBlockArrowRight(true);
                                }
                                //Si encuentra una perla debajo de la Perla2 bloquea izquierda y derecha de ambas perlas y bloquea teclado de la perla 2...
                                if (downValue2 !== null) {
                                    this.#blockA = true;
                                    this.#blockD = true;
                                    refObj1.setBlockA(true);
                                    refObj1.setBlockD(true);
                                    this.#activateKeyBoard = false;
                                    refObj1.setStopRef(true);//Informar a la perla 1 que la perla 2 colisiono
                                    this.#blockArrowLeft = true;
                                    this.#blockArrowRight = true;
                                    refObj1.setBlockArrowLeft(true);
                                    refObj1.setBlockArrowRight(true);
                                }
                            }
                        }
                        else if (this.#pos === 2 && this.#orderNumber === 1) {
                            let objRefAux1 = this.#arrMulti[this.#rowNumber][this.#columnNumber];
                            let objRefAux2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = null;
                            this.#arrMulti[this.#rowNumber + 1][this.#columnNumber] = null;
                            this.#columnNumber--;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux1;
                            this.#arrMulti[this.#rowNumber + 1][this.#columnNumber] = objRefAux2;
                        }
                        else if (this.#pos === 2 && this.#orderNumber === 2) {
                            this.#columnNumber--;

                            let refObj1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];//Obtener referencia de la perla 1
                            let nextValue2 = null;
                            let nextValue1 = null;
                            let nextValueRight2 = null;
                            let nextValueRight1 = null;
                            if (this.#columnNumber > 0) {//Si la perla dos no esta hasta la izquierda
                                nextValue2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];//Obtener el  valor de la izquierda de la perla 2
                                nextValue1 = this.#arrMulti[this.#rowNumber - 1][refObj1.getColumn() - 1];//Obtener el valor de la izquierda de la perla 1
                                nextValueRight2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];
                                nextValueRight1 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];
                            }
                            //Reestablacer valores
                            if (nextValueRight2 === null && nextValueRight1 === null) {
                                this.#blockD = false;//Bloquear tecla a
                                refObj1.setBlockD(false);//Bloquear tecla a
                                this.#blockArrowLeft = false;
                                refObj1.setBlockArrowLeft(false);
                            }
                            if (this.#pos === 2 && (nextValue2 !== null || nextValue1 !== null)) {//Si alguna referencia tiene una perla/..
                                if (nextValue1 !== null) {
                                    if (!nextValue1.getKeyBoardFlag()) {
                                        this.#blockA = true;//Bloquear a
                                        refObj1.setBlockA(true);//Bloquear a
                                        this.#blockArrowRight = true;//Bloquera flecha derecha
                                        this.setBlockArrowRight(true);//Bloquera flecha derecha
                                    }
                                }
                                else if (nextValue2 !== null)
                                    if (!nextValue2.getKeyBoardFlag()) {
                                        this.#blockA = true;//Bloquear a
                                        refObj1.setBlockA(true);//Bloquear a
                                        this.#blockArrowRight = true;//Bloquera flecha derecha
                                        this.setBlockArrowRight(true);//Bloquera flecha derecha
                                    }
                            }
                            else {
                                let refObj1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                                //Detectar objeto de abajo
                                if (this.#rowNumber < 18) {
                                    let downValue2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber]; //Obtener Objeto de la perla 1

                                    if (downValue2 !== null) {
                                        this.#blockA = true;
                                        this.#blockD = true;
                                        refObj1.setBlockA(true);
                                        refObj1.setBlockD(true);
                                        this.#activateKeyBoard = false;
                                        refObj1.setKeyBoardFlag(false);
                                    }
                                }
                            }
                        }
                        else if (this.#pos === 3 && this.#orderNumber === 1) {
                            let objRefAux1 = this.#arrMulti[this.#rowNumber][this.#columnNumber];
                            let objRefAux2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = null;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber + 1] = null; // asignar null al antiguo espacio
                            this.#columnNumber--;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux1;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber + 1] = objRefAux2;
                        }
                        else if (this.#pos === 3 && this.#orderNumber === 2) {
                            this.#columnNumber--;
                            let refObj1 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];//Obtiene la perla 1
                            let nextValue2 = null;
                            let nextValue1 = null;
                            let upValue1 = null;
                            let upValue2 = null;
                            let nextValueRight2 = null;
                            if (refObj1.getColumn() > 0) {//Si la perla 1 no esta hasta la izquierda
                                nextValue2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];//Obtiene el valor de la izquierda de la perla 2
                                nextValue1 = this.#arrMulti[this.#rowNumber][refObj1.getColumn() - 1]; //Obtiene el valor de la izquierda de la perla 1
                                nextValueRight2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];
                            }
                            //Reestablecer valores
                            if (nextValueRight2 === null) {
                                this.#blockD = false;//Bloquear tecla a
                                refObj1.setBlockD(false);//Bloquear tecla a
                            }
                            if ((this.#pos === 3 && nextValue2 !== null && nextValue1 !== null)) {//Si ambas perlas tienen valor a la izquierda
                                if (!nextValue1.getKeyBoardFlag()) {
                                    this.#blockA = true;//Bloquear tecla a
                                    refObj1.setBlockA(true);//Bloquear tecla a
                                }
                            }
                            if (this.#columnNumber > 0) {
                                //Detectar objeto de abajo cuando la perla 1 no tenga objetos a lado
                                let downValue1 = null;
                                let downValue2 = null;
                                if (this.#rowNumber < 18) {
                                    downValue1 = this.#arrMulti[refObj1.getRow() + 1][refObj1.getColumn()]; //Obtener Objeto de la perla 1
                                    downValue2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber]; //Obtener Objeto de la perla 2
                                }
                                //Si se encuentra una perla debajo de la perla 1..
                                if (downValue1 !== null) {
                                    this.#blockA = true;
                                    this.#blockD = true;
                                    refObj1.setBlockA(true);
                                    refObj1.setBlockD(true);
                                    refObj1.setKeyBoardFlag(false);
                                    this.#stopRef = true;//Informar a la perla 2 que la perla 1 colisiono
                                    this.#blockArrowLeft = true;
                                    this.#blockArrowRight = true;
                                    refObj1.setBlockArrowLeft(true);
                                    refObj1.setBlockArrowRight(true);
                                }
                                //Si encuentra una perla debajo de la Perla2 bloquea izquierda y derecha de ambas perlas y bloquea teclado de la perla 2...
                                if (downValue2 !== null) {
                                    this.#blockA = true;
                                    this.#blockD = true;
                                    refObj1.setBlockA(true);
                                    refObj1.setBlockD(true);
                                    this.#activateKeyBoard = false;
                                    refObj1.setStopRef(true);//Informar a la perla 1 que la perla 2 colisiono
                                    this.#blockArrowLeft = true;
                                    this.#blockArrowRight = true;
                                    refObj1.setBlockArrowLeft(true);
                                    refObj1.setBlockArrowRight(true);
                                }
                            }
                            ////Detectar objetos arriba de las dos perlas
                            upValue1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber - 1];
                            upValue2 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                            //Activar flecha izquierda
                            if (upValue1 === null && upValue2 === null) {
                                this.#blockArrowLeft = false;
                                refObj1.setBlockArrowLeft(false);
                            }
                            if (upValue1 !== null || upValue2 !== null) {
                                this.#blockArrowLeft = true;
                                refObj1.setBlockArrowLeft(true);
                            }
                        }
                    }
                }

            }
            else if (keyCode === keyboards.d) {
                if (!this.#blockD) {
                    if ((this.#columnNumber < 12 && this.#pos === 1 && this.#orderNumber === 1) || (this.#columnNumber < 11 && this.#pos === 1 && this.#orderNumber === 2) ||
                        (this.#columnNumber < 12 && this.#pos === 3 && this.#orderNumber === 2) || (this.#columnNumber < 11 && this.#pos === 3 && this.#orderNumber === 1) ||
                        (this.#columnNumber < 12 && (this.#pos === 0 || this.#pos === 2))) {
                        this.#square.position.x += this.#constantMovement;
                        if (this.#pos === 0 && this.#orderNumber === 1) {
                            let objRefAux1 = this.#arrMulti[this.#rowNumber][this.#columnNumber];
                            let objRefAux2 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = null;
                            this.#arrMulti[this.#rowNumber - 1][this.#columnNumber] = null;
                            this.#columnNumber++;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux1;
                            this.#arrMulti[this.#rowNumber - 1][this.#columnNumber] = objRefAux2;
                        }
                        else if (this.#pos === 0 && this.#orderNumber === 2) {
                            this.#columnNumber++;

                            let refObj1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber]; //Obtiene el objeto de abajo de la perla 1
                            let nextValue2 = null;
                            let nextValue1 = null;
                            let nextValueLeft1 = null;
                            let nextValueLeft2 = null;
                            if (refObj1.getColumn() < 12) {
                                nextValue2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];//Siguiente perla a la derecha perla 2
                                nextValue1 = this.#arrMulti[this.#rowNumber + 1][refObj1.getColumn() + 1];//Siguiente perla a la derecha perla 1
                            }
                            if (refObj1.getColumn() > 0) {
                                nextValueLeft2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];//Obtener referencia a la izquierda
                                nextValueLeft1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber - 1];//Obtener referencia a la izquierda
                            }
                            if (nextValueLeft1 === null && nextValueLeft2 === null) {
                                this.#blockA = false;
                                refObj1.setBlockA(false);
                                this.#blockArrowLeft = false;
                                refObj1.setBlockArrowLeft(false);
                            }
                            if (this.#pos === 0 && (nextValue2 !== null || nextValue1 !== null)) {//Si existe valor a la derecha de cualquier perla..
                                if (nextValue1 !== null) {//Si existe valor a la derecha de la perla 1
                                    if (!nextValue1.getKeyBoardFlag()) {
                                        this.#blockD = true;
                                        refObj1.setBlockD(true);
                                        this.#blockArrowRight = true;
                                        refObj1.setBlockArrowRight(true);
                                    }
                                }
                                else if (nextValue2 !== null)//Si existe valor a la derecha de la perla 2
                                    if (!nextValue2.getKeyBoardFlag()) {
                                        this.#blockD = true;
                                        refObj1.setBlockD(true);
                                        this.#blockArrowRight = true;
                                        refObj1.setBlockArrowRight(true);
                                    }
                            }

                            //Detectar objeto de abajo
                            if (refObj1.getRow() < 18) {
                                let downValue2 = this.#arrMulti[refObj1.getRow() + 1][this.#columnNumber]; //Obtener Objeto de la perla 1

                                if (downValue2 !== null) {
                                    this.#blockA = true;
                                    this.#blockD = true;
                                    refObj1.setBlockA(true);
                                    refObj1.setBlockD(true);
                                    this.#activateKeyBoard = false;
                                    refObj1.setKeyBoardFlag(false);
                                }
                            }



                        }
                        else if (this.#pos === 1 && this.#orderNumber === 1) {
                            let objRefAux1 = this.#arrMulti[this.#rowNumber][this.#columnNumber];
                            let objRefAux2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = null;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber - 1] = null; // asignar null al antiguo espacio
                            this.#columnNumber++;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux1;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber - 1] = objRefAux2;
                        }
                        else if (this.#pos === 1 && this.#orderNumber === 2) {
                            this.#columnNumber++;//Incrementar columna
                            let refObj1 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1]//Obtener Perla1
                            let nextValue1 = null;
                            //Obtener objetos de arriba de las perlas
                            let upValue1 = null; //Obtener Objeto de la perla 1
                            let upValue2 = null; //Obtener Objeto de la perla 2
                            let nextValueLeft = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];
                            if (nextValueLeft === null) {
                                this.#blockA = false;
                                refObj1.setBlockA(false);
                            }
                            if (this.#rowNumber > 0) {
                                upValue1 = this.#arrMulti[refObj1.getRow() - 1][refObj1.getColumn()];//Obtener Objeto de la perla 1
                                upValue2 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];//Obtener Objeto de la perla 2
                            }

                            if (refObj1.getColumn() < 12) {
                                nextValue1 = this.#arrMulti[this.#rowNumber][refObj1.getColumn() + 1];//Obtener Referencia del valor siguiente
                            }
                            if ((this.#pos === 1 && nextValue1 !== null)) {//Si existe objeto a lado de la perla1..
                                if (!nextValue1.getKeyBoardFlag()) {
                                    this.#blockD = true;
                                    refObj1.setBlockD(true);
                                }
                            }
                            if (upValue1 === null && upValue2 === null) {
                                this.#blockArrowRight = false;
                                refObj1.setBlockArrowRight(false);
                            }
                            if (this.#pos === 1 && (upValue1 !== null || upValue2 !== null)) {
                                this.#blockArrowRight = true;
                                refObj1.setBlockArrowRight(true);
                            }
                            //Detectar objeto de abajo cuando la perla 1 no tenga objetos a lado
                            if (this.#columnNumber + 1 < 12) {
                                let downValue1 = null; //Obtener Objeto de la perla 1
                                let downValue2 = null; //Obtener Objeto de la perla 2
                                if (this.#rowNumber < 18) {
                                    downValue1 = this.#arrMulti[refObj1.getRow() + 1][refObj1.getColumn()]; //Obtener Objeto de la perla 1
                                    downValue2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber]; //Obtener Objeto de la perla 2
                                }
                                //Si se encuentra una perla debajo de la perla 1..
                                if (downValue1 !== null) {
                                    this.#blockA = true;
                                    this.#blockD = true;
                                    refObj1.setBlockA(true);
                                    refObj1.setBlockD(true);
                                    refObj1.setKeyBoardFlag(false);
                                    this.#stopRef = true;//Informar a la perla 2 que la perla 1 colisiono
                                    this.#blockArrowLeft = true;
                                    this.#blockArrowRight = true;
                                    refObj1.setBlockArrowLeft(true);
                                    refObj1.setBlockArrowRight(true);
                                }
                                //Si encuentra una perla debajo de la Perla2 bloquea izquierda y derecha de ambas perlas y bloquea teclado de la perla 2...
                                if (downValue2 !== null) {
                                    this.#blockA = true;
                                    this.#blockD = true;
                                    refObj1.setBlockA(true);
                                    refObj1.setBlockD(true);
                                    this.#activateKeyBoard = false;
                                    refObj1.setStopRef(true);//Informar a la perla 1 que la perla 2 colisiono
                                    this.#blockArrowLeft = true;
                                    this.#blockArrowRight = true;
                                    refObj1.setBlockArrowLeft(true);
                                    refObj1.setBlockArrowRight(true);
                                }
                            }

                        }
                        else if (this.#pos === 2 && this.#orderNumber === 1) {
                            let objRefAux1 = this.#arrMulti[this.#rowNumber][this.#columnNumber];
                            let objRefAux2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = null;
                            this.#arrMulti[this.#rowNumber + 1][this.#columnNumber] = null;
                            this.#columnNumber++;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux1;
                            this.#arrMulti[this.#rowNumber + 1][this.#columnNumber] = objRefAux2;
                        }
                        else if (this.#pos === 2 && this.#orderNumber === 2) {
                            this.#columnNumber++;
                            let refObj1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber]; //Obtener la perla 1
                            let nextValue2 = null;
                            let nextValue1 = null;
                            let nextValueLeft1 = null;
                            let nextValueLeft2 = null;
                            if (refObj1.getColumn() < 12) {//Si la perla 1 no esta hasta la derecha
                                nextValue2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];//Obtiene el valor de la derecha de la perla 2
                                nextValue1 = this.#arrMulti[this.#rowNumber - 1][refObj1.getColumn() + 1];//Obtiene el valor de la derecha de la perla 1
                            }
                            //Evaluar objetos a la izquierda para habilitas
                            if (refObj1.getColumn() > 0) {
                                nextValueLeft2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];//Obtener referencia a la izquierda
                                nextValueLeft1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber - 1];//Obtener referencia a la izquierda
                            }
                            if (nextValueLeft1 === null && nextValueLeft2 === null) {
                                this.#blockA = false;
                                refObj1.setBlockA(false);
                                this.#blockArrowRight = false;
                                refObj1.setBlockArrowRight(false);
                            }
                            if (this.#pos === 2 && (nextValue2 !== null || nextValue1 !== null)) {//Si la perla 1 o perla 2 tienen objetos a la derecha
                                if (nextValue1 !== null) {
                                    if (!nextValue1.getKeyBoardFlag()) {
                                        this.#blockD = true;//Bloquear D
                                        refObj1.setBlockD(true);//Bloquear D
                                        this.#blockArrowLeft = true;
                                        refObj1.setBlockArrowLeft(true);
                                    }
                                }
                                else if (nextValue2 !== null)
                                    if (!nextValue2.getKeyBoardFlag()) {
                                        this.#blockD = true;//Bloquear D
                                        refObj1.setBlockD(true);//Bloquear D
                                        this.#blockArrowLeft = true;//Bloquear flecha izquierda
                                        refObj1.setBlockArrowLeft(true);//Bloquear flecha izquierda
                                    }
                            }
                            //Detectar objeto de abajo
                            if (this.#rowNumber < 18) {
                                let downValue2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber]; //Obtener Objeto de la perla 1
                                if (downValue2 !== null) {
                                    this.#blockA = true;
                                    this.#blockD = true;
                                    refObj1.setBlockA(true);
                                    refObj1.setBlockD(true);
                                    this.#activateKeyBoard = false;
                                    refObj1.setKeyBoardFlag(false);
                                }
                            }

                        }
                        else if (this.#pos === 3 && this.#orderNumber === 1) {
                            let objRefAux1 = this.#arrMulti[this.#rowNumber][this.#columnNumber];
                            let objRefAux2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = null;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber + 1] = null; // asignar null al antiguo espacio
                            this.#columnNumber++;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux1;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber + 1] = objRefAux2;
                        }
                        else if (this.#pos === 3 && this.#orderNumber === 2) {
                            this.#columnNumber++;//Incrementar a la derecha
                            let refObj1 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];//Obtener referencia del objeto 1
                            let nextValue2 = null;
                            let nextValueLeft = this.#arrMulti[this.#rowNumber][refObj1.getColumn() - 1];

                            if (nextValueLeft === null) {
                                this.#blockA = false;
                                refObj1.setBlockA(false);
                            }
                            if (this.getColumn() < 12)
                                nextValue2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];//Obtiene la referencia a la derecha de la perla 2
                            if (this.#pos === 3 && nextValue2 !== null) {
                                if (!nextValue2.getKeyBoardFlag()) {
                                    this.#blockD = true;
                                    refObj1.setBlockD(true);
                                }
                            }
                            if (this.#columnNumber < 12) {
                                //Detectar objeto de abajo cuando la perla 1 no tenga objetos a lado
                                let downValue1 = null;
                                let downValue2 = null;
                                if (this.#rowNumber < 18) {
                                    downValue1 = this.#arrMulti[refObj1.getRow() + 1][refObj1.getColumn()]; //Obtener Objeto de la perla 1
                                    downValue2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber]; //Obtener Objeto de la perla 2
                                }
                                //Si se encuentra una perla debajo de la perla 1..
                                if (downValue1 !== null) {
                                    this.#blockA = true;
                                    this.#blockD = true;
                                    refObj1.setBlockA(true);
                                    refObj1.setBlockD(true);
                                    refObj1.setKeyBoardFlag(false);
                                    this.#stopRef = true;//Informar a la perla 2 que la perla 1 colisiono
                                    this.#blockArrowLeft = true;
                                    this.#blockArrowRight = true;
                                    refObj1.setBlockArrowLeft(true);
                                    refObj1.setBlockArrowRight(true);
                                }
                                //Si encuentra una perla debajo de la Perla2 bloquea izquierda y derecha de ambas perlas y bloquea teclado de la perla 2...
                                if (downValue2 !== null) {
                                    this.#blockA = true;
                                    this.#blockD = true;
                                    refObj1.setBlockA(true);
                                    refObj1.setBlockD(true);
                                    this.#activateKeyBoard = false;
                                    refObj1.setStopRef(true);//Informar a la perla 1 que la perla 2 colisiono
                                    this.#blockArrowLeft = true;
                                    this.#blockArrowRight = true;
                                    refObj1.setBlockArrowLeft(true);
                                    refObj1.setBlockArrowRight(true);
                                }
                            }

                            //Detectar valores arriba de las perlas 
                            let upValue1 = null;
                            let upValue2 = null;

                            if (this.#rowNumber > 0) {
                                upValue1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber - 1];
                                upValue2 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                            }

                            //HAbilitar flecha izquierda
                            if (upValue1 === null && upValue2 === null) {
                                this.#blockArrowLeft = false;
                                refObj1.setBlockArrowLeft(false);
                            }

                            if (upValue1 !== null || upValue2 !== null) {
                                this.#blockArrowLeft = true;
                                refObj1.setBlockArrowLeft(true);
                            }

                        }
                    }
                }
            }
            else if (keyCode === keyboards.s) {
                this.moveDown();
            }
            else if (keyCode === keyboards.izq) {
                if (this.#pos === 0) {
                    if (!this.#blockArrowLeft) {
                        if (this.#columnNumber > 0) {
                            if (this.#orderNumber === 2) {
                                this.#square.position.x -= this.#constantPosition;
                                this.#square.position.y -= this.#constantPosition;
                                let objRefAux = this.#arrMulti[this.#rowNumber][this.#columnNumber]; // Guardar referenica
                                this.#arrMulti[this.#rowNumber][this.#columnNumber] = null; // asignar null al antiguo espacio
                                this.#columnNumber--;
                                this.#rowNumber++;
                                this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux; // Asignar objeto auxiliar a la nueva referencia de la matriz

                                //Obtener el valor de abajo de la perla 2
                                let refObj1 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];
                                let downValue2 = null;
                                if (this.#rowNumber < 18)
                                    downValue2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];

                                if (downValue2 !== null) {
                                    this.#blockA = true;
                                    refObj1.setBlockA(true);
                                    this.#blockD = true;
                                    refObj1.setBlockD(true);
                                    this.#activateKeyBoard = false;
                                    refObj1.setStopRef(true);//Informar a la perla 1 que la perla dos colisiono
                                    this.#blockArrowLeft = true;
                                    refObj1.setBlockArrowLeft(true);
                                    this.#blockArrowRight = true;
                                    refObj1.setBlockArrowRight(true);
                                }

                                //Obtener valor de la izquierda de la perla 2
                                let nextValueLeft2 = null;
                                if (this.#columnNumber > 0)
                                    nextValueLeft2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];

                                if (nextValueLeft2 !== null) {
                                    this.#blockA = true;
                                    refObj1.setBlockA(true);
                                }

                                //Obtener objetos arriba de la perla 1 y 2
                                let upValue1 = null;
                                let upValue2 = null;
                                if (this.#rowNumber < 18) {
                                    upValue1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber + 1];//Obtener el valor arriba de la perla 1
                                    upValue2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];//Obtener el valor de arriba de la perla 2
                                }
                                if (upValue1 === null && upValue2 === null) {
                                    this.#blockArrowRight = false;
                                    refObj1.setBlockArrowRight(false);
                                }

                                //Obtener valores de la derecha de la perla 1
                                let nextValueRight1 = null;
                                if (this.#columnNumber < 12)
                                    nextValueRight1 = this.#arrMulti[this.#rowNumber][refObj1.getColumn() + 1];//Obtener valor de la derecha de la perla 1

                                if (nextValueRight1 === null) {
                                    this.#blockD = false;
                                    refObj1.setBlockD(false);
                                }

                            }
                            this.#pos = 1;
                        }
                    }
                }
                else if (this.#pos === 1) {
                    if (!this.#blockArrowLeft) {
                        if (this.#rowNumber < 18) {
                            if (this.#orderNumber === 2) {
                                this.#square.position.x += this.#constantPosition;
                                this.#square.position.y -= this.#constantPosition;
                                let objRefAux = this.#arrMulti[this.#rowNumber][this.#columnNumber]; // Guardar referenica
                                this.#arrMulti[this.#rowNumber][this.#columnNumber] = null; // asignar null al antiguo espacio
                                this.#columnNumber++;
                                this.#rowNumber++;
                                this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux; // Asignar objeto auxiliar a la nueva referencia de la matriz

                                ///Detecar objetos a la derecha
                                let refObj1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                                let nextValueRight2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];//Obtener siguiente valor a la derecha de la perla 2
                                let nextValueRight1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber + 1];//Obtener siguiente valor a la derecha de la perla 1

                                if (nextValueRight2 !== null || nextValueRight1 !== null) {
                                    this.#blockArrowLeft = true;
                                    this.setBlockArrowLeft(true);
                                }

                                if (this.#columnNumber > 0) {
                                    let nextValueLeft2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];//Obtener referencia a la izquierda de la perla 2
                                    let nextValueLeft1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber - 1];//Obtener referencia a la izquierda de la perla 1
                                    if (nextValueLeft1 === null || nextValueLeft2 === null) {
                                        this.#blockA = false;
                                        refObj1.setBlockA(false);
                                        this.#blockArrowRight = false;
                                        refObj1.setBlockArrowRight(false);

                                    }
                                }
                            }
                            this.#pos = 2;
                        }
                    }
                }
                else if (this.#pos === 2) {
                    if (!this.#blockArrowLeft) {
                        if (this.#columnNumber < 12) {
                            if (this.#orderNumber === 2) {
                                this.#square.position.x += this.#constantPosition;
                                this.#square.position.y += this.#constantPosition;
                                let objRefAux = this.#arrMulti[this.#rowNumber][this.#columnNumber]; // Guardar referenica
                                this.#arrMulti[this.#rowNumber][this.#columnNumber] = null; // asignar null al antiguo espacio
                                this.#columnNumber++;
                                this.#rowNumber--;
                                this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux; // Asignar objeto auxiliar a la nueva referencia de la matriz

                                //Obtener referencia a la derecha de la perla 2
                                let nextValueRight2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];
                                let refObj1 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];
                                if (nextValueRight2 !== null) {
                                    this.#blockD = true;
                                    refObj1.setBlockD('true');
                                }

                                //Obtener referencias abajo de las perlas
                                let nextValueDown1 = null;
                                let nextValueDown2 = null;

                                if (this.#rowNumber < 18) {
                                    nextValueDown2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];
                                    nextValueDown1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber - 1];
                                }
                                console.log(nextValueDown2);
                                console.log(nextValueDown1);
                                if (nextValueDown1 === null && nextValueDown2 === null) {
                                    this.#blockArrowRight = false;
                                    refObj1.setBlockArrowRight(false);
                                }

                                //Obtener referencias arriba de las perlas
                                let nextValueup1 = null;
                                let nextValueup2 = null;

                                if (this.#rowNumber > 0) {
                                    nextValueup2 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                                    nextValueup1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber - 1];
                                }
                                if (nextValueup2 !== null || nextValueup1 !== null) {
                                    this.#blockArrowLeft = true;
                                    refObj1.setBlockArrowLeft(true);
                                }

                            }
                            this.#pos = 3;
                        }
                    }
                }
                else if (this.#pos === 3) {
                    if (!this.#blockArrowLeft) {
                        if (this.#orderNumber === 2) {
                            this.#square.position.x -= this.#constantPosition;
                            this.#square.position.y += this.#constantPosition;
                            let objRefAux = this.#arrMulti[this.#rowNumber][this.#columnNumber]; // Guardar referenica
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = null; // asignar null al antiguo espacio
                            this.#columnNumber--;
                            this.#rowNumber--;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux; // Asignar objeto auxiliar a la nueva referencia de la matriz

                            //Obtener referencia a la izquierda de la perla 2
                            let refObj1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];
                            let nextValueLeft2 = null;
                            let nextValueLeft1 = null;
                            let nextValueRight1 = null;
                            let nextValueRight2 = null;
                            if (this.#columnNumber > 0) {
                                nextValueLeft2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];//Obtiene el valor de la izquierda de al perla 2
                                nextValueLeft1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber - 1];//Obtiene el valor de la izquierda de al perla 2
                                nextValueRight1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber + 1];
                                nextValueRight2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];
                            }
                            if (nextValueRight1 === null && nextValueRight2 === null) {
                                this.#blockD = false;
                                refObj1.setBlockD(false);
                            }
                            if (nextValueLeft2 !== null || nextValueLeft1 !== null) {
                                this.#blockArrowLeft = true;
                                refObj1.setBlockArrowLeft(true);
                                this.#blockA = true;
                                refObj1.setBlockA(true);
                            }

                        }
                        this.#pos = 0;
                    }
                }
            }
            else if (keyCode === keyboards.der) {
                if (this.#pos === 0) {
                    if (!this.#blockArrowRight) {
                        if (this.#columnNumber < 12) {
                            if (this.#orderNumber === 2) {
                                this.#square.position.x += this.#constantPosition;
                                this.#square.position.y -= this.#constantPosition;
                                let objRefAux = this.#arrMulti[this.#rowNumber][this.#columnNumber]; // Guardar referenica
                                this.#arrMulti[this.#rowNumber][this.#columnNumber] = null; // asignar null al antiguo espacio
                                this.#columnNumber++;
                                this.#rowNumber++;
                                this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux; // Asignar objeto auxiliar a la nueva referencia de la matriz
                                //Detectar objetos a la derecha de la perla 2
                                let nextValueRight2 = null;
                                let nextValueLeft1 = null;
                                let refObj1 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];

                                if (this.#columnNumber > 0)
                                    nextValueLeft1 = nextValueRight2 = this.#arrMulti[this.#rowNumber][refObj1.getColumn() - 1];

                                if (nextValueLeft1 === null) {
                                    this.#blockA = false;
                                    refObj1.setBlockA(false);
                                }

                                if (this.#columnNumber < 12) {
                                    nextValueRight2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];//Obtener referencia a la derecha de la perla 2
                                    //Detectar objetos del lado derecho de la perla 2
                                    if (nextValueRight2 != null) {
                                        this.#blockD = true;
                                        refObj1.setBlockD(true);
                                    }
                                }
                                //Detectar objetos abajo de la perla 2
                                let nextValueDown2 = null;
                                if (this.#columnNumber < 12) {
                                    if (this.#rowNumber < 18)
                                        nextValueDown2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];//Obtener Referencia de la perla debajo de la perla 2
                                    if (nextValueDown2 != null) {
                                        this.#blockA = true;
                                        refObj1.setBlockA(true);
                                        this.#blockD = true;
                                        refObj1.setBlockD(true);
                                        this.#activateKeyBoard = false;
                                        refObj1.setStopRef(true);//Informar a la perla 1 que la perla dos colisiono
                                        this.#blockArrowLeft = true;
                                        refObj1.setBlockArrowLeft(true);
                                        this.#blockArrowRight = true;
                                        refObj1.setBlockArrowRight(true);
                                    }
                                }

                                //Obtener objetos arriba de la perla 1 y 2
                                let upValue1 = null;
                                let upValue2 = null;
                                if (this.#rowNumber < 18) {
                                    upValue1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber - 1];//Obtener el valor arriba de la perla 1
                                    upValue2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];//Obtener el valor de arriba de la perla 2
                                }
                                if (upValue1 === null && upValue2 === null) {
                                    this.#blockArrowLeft = false;
                                    refObj1.setBlockArrowLeft(false);
                                }
                            }
                            this.#pos = 3;
                        }
                    }
                }
                else if (this.#pos === 1) {
                    if (!this.#blockArrowRight) {
                        if (this.#orderNumber === 2) {
                            this.#square.position.x += this.#constantPosition;
                            this.#square.position.y += this.#constantPosition;
                            let objRefAux = this.#arrMulti[this.#rowNumber][this.#columnNumber]; // Guardar referenica
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = null; // asignar null al antiguo espacio
                            this.#columnNumber++;
                            this.#rowNumber--;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux;
                            //Detectar objetos a la derecha de la perla 1
                            let nextValueRight1 = null;
                            let nextValueRight2 = null;
                            let nextValueLeft1 = null;
                            let nextValueLeft2 = null;
                            let refObj1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];//Obtiene la perla1

                            if (this.#columnNumber < 12) {
                                nextValueRight1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber + 1];//Obtener referencia a la derecha de la perla 1
                                nextValueRight2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];//Obtener referencia a la derecha de la perla 2
                                if (nextValueRight1 != null || nextValueRight2 !== null) {
                                    this.#blockArrowRight = true;
                                    refObj1.setBlockArrowRight(true);
                                    this.#blockD = true;
                                    refObj1.setBlockD(true);
                                }
                            }
                            if (this.#columnNumber > 0) {
                                nextValueLeft1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber - 1];//Obtener referencia a la derecha de la perla 1
                                nextValueLeft2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];//Obtener referencia a la derecha de la perla 2
                                if (nextValueLeft1 === null || nextValueLeft2 === null) {
                                    this.#blockA = false;
                                    refObj1.setBlockA(false);
                                }
                            }
                        }
                        this.#pos = 0;
                    }
                }
                else if (this.#pos === 2) {
                    if (!this.#blockArrowRight) {
                        if (this.#columnNumber > 0) {
                            if (this.#orderNumber === 2) {
                                this.#square.position.x -= this.#constantPosition;
                                this.#square.position.y += this.#constantPosition;
                                let objRefAux = this.#arrMulti[this.#rowNumber][this.#columnNumber]; // Guardar referenica
                                this.#arrMulti[this.#rowNumber][this.#columnNumber] = null; // asignar null al antiguo espacio
                                this.#columnNumber--;
                                this.#rowNumber--;
                                this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux;

                                //Obtener valores de la Izquierda de la perla 2
                                let nextValueLeft2 = null;
                                let refObj1 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];
                                if (this.#columnNumber > 0)
                                    nextValueLeft2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];

                                if (nextValueLeft2 !== null) {
                                    this.#blockA = true;
                                    refObj1.setBlockA(true);
                                }

                                //Obtener objetos abajo
                                let downValue1 = null;
                                let downValue2 = null;
                                if (this.#rowNumber < 18) {
                                    downValue2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];
                                    downValue1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber + 1];
                                }
                                if (downValue1 === null && downValue2 === null) {
                                    this.#blockArrowLeft = false;
                                    refObj1.setBlockArrowLeft(false);
                                }

                                //Obtener objetos aarriba
                                let upValue1 = null;
                                let upValue2 = null;
                                if (this.#rowNumber > 0) {
                                    upValue1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                                    upValue2 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber + 1];
                                }
                                if (upValue1 === null && upValue2 === null) {
                                    this.#blockArrowRight = false;
                                    refObj1.setBlockArrowRight(false);
                                }
                                if (upValue1 !== null || upValue2 !== null) {
                                    this.#blockArrowRight = true;
                                    refObj1.setBlockArrowRight(true);
                                }
                            }
                            this.#pos = 1;
                        }
                    }
                }
                else if (this.#pos === 3) {
                    if (!this.#blockArrowRight) {
                        if (this.#rowNumber < 18) {
                            if (this.#orderNumber === 2) {
                                this.#square.position.x -= this.#constantPosition;
                                this.#square.position.y -= this.#constantPosition;
                                let objRefAux = this.#arrMulti[this.#rowNumber][this.#columnNumber]; // Guardar referenica
                                this.#arrMulti[this.#rowNumber][this.#columnNumber] = null; // asignar null al antiguo espacio
                                this.#columnNumber--;
                                this.#rowNumber++;
                                this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux;

                                //Detecar objetos a la izquierda
                                let refObj1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                                let nextValueLeft2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];//Obtener siguiente valor a la izquierda de la perla 2
                                let nextValueLeft1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber - 1];//Obtener siguiente valor a la izquierda de la perla 2
                                let nextValueRight1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber + 1];
                                let nextValueRight2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];

                                if (nextValueRight1 === null && nextValueRight2 === null) {
                                    this.#blockD = false;
                                    refObj1.setBlockD(false);
                                    this.#blockArrowLeft = false;
                                    this.setBlockArrowLeft(false);
                                }

                                if (nextValueLeft2 !== null || nextValueLeft1 !== null) {
                                    this.#blockArrowRight = true;
                                    this.setBlockArrowRight(true);
                                    this.#blockA = true;
                                    refObj1.setBlockA(true);
                                }
                            }
                            this.#pos = 2;
                        }
                    }
                }
            }
            // if (this.#orderNumber === 2) {
            //     this.detectCombos();
            // }
        }
    }

    moveDown() {
        if ((this.#rowNumber < 18 && this.#pos === 0 && this.#orderNumber === 1) || (this.#rowNumber < 17 && this.#pos === 0 && this.#orderNumber === 2) ||
            (this.#rowNumber < 18 && this.#pos === 2 && this.#orderNumber === 2) || (this.#rowNumber < 17 && this.#pos === 2 && this.#orderNumber === 1) ||
            (this.#rowNumber < 18 && (this.#pos === 1 || this.#pos === 3))) {
            this.#square.position.y -= this.#constantMovement;


            if (this.#pos === 0 && this.#orderNumber === 1) {
                let objRefAux2 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                let objRefAux1 = this.#arrMulti[this.#rowNumber][this.#columnNumber];
                this.#arrMulti[this.#rowNumber - 1][this.#columnNumber] = null;
                this.#arrMulti[this.#rowNumber][this.#columnNumber] = null;
                this.#rowNumber++;
                this.#arrMulti[this.#rowNumber - 1][this.#columnNumber] = objRefAux2;
                this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux1;

            }
            else if (this.#pos === 0 && this.#orderNumber === 2) {
                this.#rowNumber++;
                let refObj1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];//Referencia de la perla 1
                let nextValue2 = null;
                let nextValue1 = null;
                if (refObj1.getRow() < 18) {
                    nextValue2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];
                    nextValue1 = this.#arrMulti[refObj1.getRow() + 1][this.#columnNumber];
                }
                if ((this.#pos === 0 && nextValue2 !== null && nextValue1 !== null)) {//Cuando las perlas colisionen con perla abajo en pos 0
                    if (!nextValue1.getKeyBoardFlag()) {
                        this.#activateKeyBoard = false;
                        refObj1.setKeyBoardFlag(false);
                    }
                }

                //Evaluar objetos a la izquierda
                nextValue2 = null;
                nextValue1 = null;
                if (refObj1.getColumn() > 0) {//Si no esta en los limites de la izquierda
                    nextValue2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];//Obtiene referencia a la izquierda de la perla 2
                    nextValue1 = this.#arrMulti[this.#rowNumber + 1][refObj1.getColumn() - 1];//Obtiene referencia a la izquierda de la perla 1
                }
                if (nextValue1 === null && nextValue2 === null) {
                    this.#blockA = false;
                    refObj1.setBlockA(false);
                    this.#blockArrowLeft = false;
                    refObj1.setBlockArrowLeft(false);
                }
                if (this.#pos === 0 && (nextValue2 !== null || nextValue1 !== null)) {
                    if (nextValue1 !== null) {
                        if (!nextValue1.getKeyBoardFlag()) {
                            this.#blockA = true;
                            refObj1.setBlockA(true);
                            this.#blockArrowLeft = true;
                            refObj1.setBlockArrowLeft(true);
                        }
                    }
                    else if (nextValue2 !== null)
                        if (!nextValue2.getKeyBoardFlag()) {
                            this.#blockA = true;
                            refObj1.setBlockA(true);
                            this.#blockArrowLeft = true;
                            refObj1.setBlockArrowLeft(true);
                        }
                }

                //Evaluar objetos a la derecha
                nextValue2 = null;
                nextValue1 = null;
                if (refObj1.getColumn() < 12) {
                    nextValue2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];
                    nextValue1 = this.#arrMulti[this.#rowNumber + 1][refObj1.getColumn() + 1];
                }
                if (nextValue1 === null && nextValue2 === null) {
                    this.#blockD = false;
                    refObj1.setBlockD(false);
                    this.#blockArrowRight = false;
                    refObj1.setBlockArrowRight(false);
                }
                if (this.#pos === 0 && (nextValue2 !== null || nextValue1 !== null)) {
                    if (nextValue1 !== null) {
                        if (!nextValue1.getKeyBoardFlag()) {
                            this.#blockD = true;
                            refObj1.setBlockD(true);
                            this.#blockArrowRight = true;
                            refObj1.setBlockArrowRight(true);
                        }
                    }
                    else if (nextValue2 !== null)
                        if (!nextValue2.getKeyBoardFlag()) {
                            this.#blockD = true;
                            refObj1.setBlockD(true);
                            this.#blockArrowRight = true;
                            refObj1.setBlockArrowRight(true);
                        }
                }
            }
            else if (this.#pos === 1 && this.#orderNumber === 1) {
                if (!this.#stopRef) {
                    let objRefAux1 = this.#arrMulti[this.#rowNumber][this.#columnNumber];
                    let objRefAux2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];
                    this.#arrMulti[this.#rowNumber][this.#columnNumber] = null;
                    this.#arrMulti[this.#rowNumber][this.#columnNumber - 1] = null;
                    this.#rowNumber++;
                    this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux1;
                    this.#arrMulti[this.#rowNumber][this.#columnNumber - 1] = objRefAux2;
                }
                else {
                    this.#rowNumber++;
                    let nextValueDown1 = null;
                    if (this.#rowNumber < 18) {
                        nextValueDown1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];//Obtener la referencia de abajo de la perla 2
                    }

                    if (this.#pos === 1) {
                        if (nextValueDown1 !== null) {//Si la referencia de abajo es una perla..
                            if (!nextValueDown1.getKeyBoardFlag()) {
                                this.#activateKeyBoard = false; //Bloquear el movimiento a la perla 2
                                let objRefAux1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                                this.#arrMulti[this.#rowNumber - 1][this.#columnNumber] = null;
                                this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux1;
                            }
                        }
                        else {
                            //Si no existe perla abajo de la perla 2, guardar perla 2 en la siguiente posicion de la matriz
                            let objRefAux1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                            this.#arrMulti[this.#rowNumber - 1][this.#columnNumber] = null;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux1;
                        }
                    }
                }
            }
            else if (this.#pos === 1 && this.#orderNumber === 2) {
                this.#rowNumber++;//Incrementa hacia abajo

                if (!this.#stopRef) {//Si la perla 1 no colisiono
                    let refObj1 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1]; //Obtener Perla1
                    let nextValue2 = null;
                    let nextValue1 = null;
                    let nextValueRight1 = null;
                    let nextValueLeft2 = null;

                    if (this.#rowNumber < 18) {
                        nextValue2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber]; //Obtener referencia abajo de la perla 2
                        nextValue1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber + 1]; //Obtener referecia abajo de la perla 1
                        nextValueRight1 = this.#arrMulti[this.#rowNumber][refObj1.getColumn() + 1];//Obtener referencia a la derecha de la perla 1
                        nextValueLeft2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];//Obtener referencia a la izquierda de la perla 2
                    }

                    if (nextValueRight1 === null) {
                        this.#blockD = false;
                        refObj1.setBlockD(false);
                    }
                    if (nextValueLeft2 === null) {
                        this.#blockA = false;
                        refObj1.setBlockA(false);
                    }
                    //Detectar objetos del lado derecho
                    if (nextValueRight1 != null) {
                        this.#blockD = true;
                        refObj1.setBlockD(true);
                    }
                    if (nextValueLeft2 != null) {
                        this.#blockA = true;
                        refObj1.setBlockA(true);
                    }
                    if (this.#pos === 1 && (nextValue2 !== null || nextValue1 !== null)) {//Si existe perla debajo de la perla 1 o la perla 2...
                        if (nextValue2 !== null) {//Si existe perla debajo de la perla 2
                            if (!nextValue2.getKeyBoardFlag()) {
                                this.#blockA = true;
                                refObj1.setBlockA(true);
                                this.#blockD = true;
                                refObj1.setBlockD(true);
                                this.#activateKeyBoard = false;
                                refObj1.setStopRef(true);//Informar a la perla 1 que la perla dos colisiono
                                this.#blockArrowLeft = true;
                                refObj1.setBlockArrowLeft(true);
                                this.#blockArrowRight = true;
                                refObj1.setBlockArrowRight(true);
                            }
                        }
                        if (nextValue1 !== null) {//Si existe perla debajo de la perla 1..
                            if (!nextValue1.getKeyBoardFlag()) {
                                this.#blockA = true;
                                refObj1.setBlockA(true);
                                this.#blockD = true;
                                refObj1.setBlockD(true);
                                refObj1.setKeyBoardFlag(false);
                                this.#stopRef = true;//Informar a la perla 2 que la perla 1 colisiono
                                this.#blockArrowLeft = true;
                                refObj1.setBlockArrowLeft(true);
                                this.#blockArrowRight = true;
                                refObj1.setBlockArrowRight(true);
                            }
                        }
                    }
                }
                else { //Si la perla 1 Colisiono...
                    let nextValue2 = null;
                    if (this.#rowNumber < 18) {
                        nextValue2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];//Obtener la referencia de abajo de la perla 2
                    }
                    else {
                        this.#activateKeyBoard = false;
                        this.#blockA = true;
                        this.#blockD = true;
                        this.#blockArrowLeft = true;
                        this.#blockArrowRight = true;
                    }
                    if (this.#pos === 1) {
                        if (nextValue2 !== null) {//Si la referencia de abajo es una perla..
                            if (!nextValue2.getKeyBoardFlag()) {
                                this.#activateKeyBoard = false; //Bloquear el movimiento a la perla 2
                                let objRefAux2 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                                this.#arrMulti[this.#rowNumber - 1][this.#columnNumber] = null;
                                this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux2;
                            }
                        }
                        else {
                            //Si no existe perla abajo de la perla 2, guardar perla 2 en la siguiente posicion de la matriz
                            let objRefAux2 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                            this.#arrMulti[this.#rowNumber - 1][this.#columnNumber] = null;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux2;
                        }
                    }
                }
            }
            else if (this.#pos === 2 && this.#orderNumber === 1) {
                let objRefAux2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];
                let objRefAux1 = this.#arrMulti[this.#rowNumber][this.#columnNumber];
                this.#arrMulti[this.#rowNumber + 1][this.#columnNumber] = null;
                this.#arrMulti[this.#rowNumber][this.#columnNumber] = null;
                this.#rowNumber++;
                this.#arrMulti[this.#rowNumber + 1][this.#columnNumber] = objRefAux2;
                this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux1;
            }
            else if (this.#pos === 2 && this.#orderNumber === 2) {
                this.#rowNumber++;
                let refObj1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];//Obtener referencia de la perla 1
                let nextValue2 = null;
                let nextValue1 = null;

                if (this.#rowNumber < 18) {//Si la perla 2 no esta hasta abajo
                    nextValue2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];//Obtener la referencia que esta debajo de la perla2
                    nextValue1 = this.#arrMulti[this.#rowNumber][this.#columnNumber];//Obtener la referencia que esta debajo de la perla 1, obtiene siempre la perla 2
                }
                if ((this.#pos === 2 && nextValue2 !== null && nextValue1 !== null)) {//Si ambas perlas tienen objetos debajo..
                    if (!nextValue2.getKeyBoardFlag()) {
                        this.#activateKeyBoard = false;//Bloquear teclado
                        refObj1.setKeyBoardFlag(false);//Bloquear teclado
                    }
                }

                //Evaluar objetos a la izquierda
                nextValue2 = null;
                nextValue1 = null;

                if (refObj1.getColumn() > 0) {//Si no esta a la izqueda la perla 1
                    nextValue2 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];//Obtener el valor de la izquierda de la perla 2
                    nextValue1 = this.#arrMulti[this.#rowNumber - 1][refObj1.getColumn() - 1];//Obtener el valor de la izquierda de la perla 1
                }
                if (nextValue1 === null && nextValue2 === null) {
                    this.#blockA = false;
                    refObj1.setBlockA(false);
                    this.#blockArrowRight = false;
                    refObj1.setBlockArrowRight(false);
                }
                if (this.#pos === 2 && (nextValue2 !== null || nextValue1 !== null)) {//Si cualquiera de las perlas tiene alguna referencia
                    if (nextValue1 !== null) {
                        if (!nextValue1.getKeyBoardFlag()) {
                            this.#blockA = true;//Bloquear tecla a
                            refObj1.setBlockA(true);//Bloquear tecla a
                            this.#blockArrowRight = true;//bloquear flecha derecha
                            refObj1.setBlockArrowRight(true);//bloquear flecha derecha
                        }
                    }
                    else if (nextValue2 !== null)
                        if (!nextValue2.getKeyBoardFlag()) {
                            this.#blockA = true;//Bloquear tecla a
                            refObj1.setBlockA(true);//Bloquear tecla a
                            this.#blockArrowRight = true;//bloquear flecha derecha
                            refObj1.setBlockArrowRight(true);//bloquear flecha derecha
                        }
                }

                //Evaluar objetos a la derecha
                nextValue2 = null;
                nextValue1 = null;
                if (refObj1.getColumn() < 12) {//Si el objeto 1 no esta hasta la derecha
                    nextValue2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];//Obtener objeto a la derecha de la perla 2
                    nextValue1 = this.#arrMulti[this.#rowNumber - 1][refObj1.getColumn() + 1];//Obtener objeto a la derecha de la perla 1
                }
                if (nextValue1 === null && nextValue2 === null) {
                    this.#blockD = false;
                    refObj1.setBlockD(false);
                    this.#blockArrowLeft = false;
                    refObj1.setBlockArrowLeft(false);
                }
                if (this.#pos === 2 && (nextValue2 !== null || nextValue1 !== null)) {//Si existe alguna perla a la derecha de las perlas 1 o 2
                    if (nextValue1 !== null) {
                        if (!nextValue1.getKeyBoardFlag()) {
                            this.#blockD = true;//bloquear tecla d
                            refObj1.setBlockD(true);//bloquear tecla d
                            this.#blockArrowLeft = true;//Bloquear tecla flecha izquierda
                            this.setBlockArrowLeft(true);//Bloquear tecla flecha izquierda
                        }
                    }
                    else if (nextValue2 !== null)
                        if (!nextValue2.getKeyBoardFlag()) {
                            this.#blockD = true;//bloquear tecla d
                            refObj1.setBlockD(true);//bloquear tecla d
                            this.#blockArrowLeft = true;//Bloquear tecla flecha izquierda
                            this.setBlockArrowLeft(true);//Bloquear tecla flecha izquierda
                        }
                }
            }
            else if (this.#pos === 3 && this.#orderNumber === 1) {
                if (!this.#stopRef) {
                    let objRefAux1 = this.#arrMulti[this.#rowNumber][this.#columnNumber];
                    let objRefAux2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];
                    this.#arrMulti[this.#rowNumber][this.#columnNumber] = null;
                    this.#arrMulti[this.#rowNumber][this.#columnNumber + 1] = null; // asignar null al antiguo espacio
                    this.#rowNumber++;
                    this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux1;
                    this.#arrMulti[this.#rowNumber][this.#columnNumber + 1] = objRefAux2;
                }
                else {
                    this.#rowNumber++;
                    let nextValueDown1 = null;
                    if (this.#rowNumber < 18) {
                        nextValueDown1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];//Obtener la referencia de abajo de la perla 2
                    }
                    if (this.#pos === 3) {
                        if (nextValueDown1 !== null) {//Si la referencia de abajo es una perla..
                            if (!nextValueDown1.getKeyBoardFlag()) {
                                this.#activateKeyBoard = false; //Bloquear el movimiento a la perla 2
                                let objRefAux1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                                this.#arrMulti[this.#rowNumber - 1][this.#columnNumber] = null;
                                this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux1;
                            }
                        }
                        else {
                            //Si no existe perla abajo de la perla 2, guardar perla 2 en la siguiente posicion de la matriz
                            let objRefAux1 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                            this.#arrMulti[this.#rowNumber - 1][this.#columnNumber] = null;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux1;
                        }
                    }
                }
            }
            else if (this.#pos === 3 && this.#orderNumber === 2) {
                this.#rowNumber++;
                if (!this.#stopRef) {
                    let refObj1 = this.#arrMulti[this.#rowNumber][this.#columnNumber - 1];//Obtener perla 1
                    let nextValue2 = null;
                    let nextValue1 = null;
                    let nextValueRight2 = null;
                    let nextValueLeft1 = null;
                    if (this.#rowNumber < 18) {//Si la perla 2 no esta pegado al suelo
                        nextValue2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];//Obtener el valor de abajo de la perla 2
                        nextValue1 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber - 1];//Obtener el valor de abajo de la perla 1
                        nextValueRight2 = this.#arrMulti[this.#rowNumber][this.#columnNumber + 1];//Obtener referencia a la derecha de la perla 2
                    }
                    //Detectar objetos del lado derecho
                    if (nextValueRight2 !== null) {//Si existe una perla a la derecha de la perla 2
                        this.#blockD = true;//Bloquear tecla d
                        refObj1.setBlockD(true);//bloquear tecla d
                    }
                    //Detecar objetos a la izquierda de la perla 1
                    if (refObj1.getColumn() > 0)
                        nextValueLeft1 = this.#arrMulti[this.#rowNumber][refObj1.getColumn() - 1];
                    if (nextValueLeft1 === null) {
                        this.#blockA = false;
                        refObj1.setBlockA(false);
                    }
                    if (nextValueRight2 === null) {
                        this.#blockD = false;
                        refObj1.setBlockD(false);
                    }
                    if (nextValueLeft1 !== null) {
                        this.#blockA = true;
                        refObj1.setBlockA(true)
                    }
                    if (this.#pos === 3 && (nextValue2 !== null || nextValue1 !== null)) {//Si existen objetos debajo de la perla 1 o la perla 2
                        if (nextValue2 !== null) {//Si la perla 2 tiene una perla abajo y la perla 1 no
                            if (!nextValue2.getKeyBoardFlag()) {
                                this.#blockA = true;//Bloquear tecla a
                                refObj1.setBlockA(true);//Bloquear tecla a
                                this.#blockD = true;//Bloquear tecla d
                                refObj1.setBlockD(true);//Bloquear tecla d
                                this.#activateKeyBoard = false;//Bloquear teclado perla 2
                                refObj1.setStopRef(true);//Informar a la perla 1 que la perla dos colisiono

                            }
                        }
                        if (nextValue1 !== null) {//si existe Perla debajo de la perla 1
                            if (!nextValue1.getKeyBoardFlag()) {
                                this.#blockA = true;//Bloquera tecla a
                                refObj1.setBlockA(true);//Bloquera tecla a
                                this.#blockD = true;//Bloquera tecla d
                                this.#blockArrowLeft = true;//Bloquear tecla flecha izquierda
                                this.#blockArrowRight = true;//Bloquear tecla flecha derecha
                                refObj1.setBlockD(true);//Bloquera tecla d
                                refObj1.setKeyBoardFlag(false);//Bloquear teclado perla 1
                                this.#stopRef = true;//Informar a la perla 2 que la perla 1 colisiono
                            }
                        }
                    }
                }
                else {//Este else se usa para detecar colisiones cuando la perlla 2 se quede sola
                    let nextValue2 = null;
                    if (this.#rowNumber < 18) {
                        nextValue2 = this.#arrMulti[this.#rowNumber + 1][this.#columnNumber];

                    }
                    if (this.#pos === 3) {
                        if (nextValue2 !== null) {

                            if (!nextValue2.getKeyBoardFlag()) {
                                this.#activateKeyBoard = false;
                                let objRefAux2 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                                this.#arrMulti[this.#rowNumber - 1][this.#columnNumber] = null;
                                this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux2;
                            }
                        }
                        else {
                            let objRefAux2 = this.#arrMulti[this.#rowNumber - 1][this.#columnNumber];
                            this.#arrMulti[this.#rowNumber - 1][this.#columnNumber] = null;
                            this.#arrMulti[this.#rowNumber][this.#columnNumber] = objRefAux2;
                        }
                    }
                }
            }
        }
        if ((this.#rowNumber === 18 && (this.#pos === 1 || this.#pos === 3)) ||
            (this.#rowNumber === 17 && this.#pos === 0 && this.#orderNumber === 2) ||
            (this.#rowNumber === 18 && this.#pos === 0 && this.#orderNumber === 1) ||
            (this.#rowNumber === 17 && this.#pos === 2 && this.#orderNumber === 1) ||
            (this.#rowNumber === 18 && this.#pos === 2 && this.#orderNumber === 2)) {
            this.#activateKeyBoard = false;
            this.#blockA = true;
            this.#blockD = true;
            this.#blockArrowLeft = true;
            this.#blockArrowRight = true;
        }
    }

    tick() {
        if (this.#activateKeyBoard && !this.#moveDownAfterCombos) {//Si no hay ninguno en movimiento
            this.moveDown();
        }
    }
}

export { EvilPearl }
