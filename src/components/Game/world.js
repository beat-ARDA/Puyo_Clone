import * as THREE from 'three';
import { EvilPearl } from './evilPearl';

class World {
    scene;
    camera;
    renderer;
    geometry;
    material;
    cube;
    square;
    #pearls = [];
    #container;
    #arregloMultidimensional = [];
    #clock;
    animacionActiva = true;

    constructor(container) {
        this.#clock = new THREE.Clock();
        const filas = 19;
        const columnas = 13;

        // Crear el arreglo multidimensional e inicializarlo con valores nulos
        for (var i = 0; i < filas; i++) {
            this.#arregloMultidimensional[i] = []; // Inicializar una nueva fila
            for (var j = 0; j < columnas; j++) {
                this.#arregloMultidimensional[i][j] = null; // Asignar null a cada elemento
            }
        }

        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.#container = container;
        this.#container.append(this.renderer.domElement);
        const width = this.#container.clientWidth;
        const height = this.#container.clientHeight;
        const aspectRatio = width / height;
        const zoomFactor = 1;
        const near = 0.1;
        const far = 1000;
        this.camera = new THREE.OrthographicCamera(-aspectRatio * zoomFactor, aspectRatio * zoomFactor, 1 * zoomFactor, -1 * zoomFactor, near, far);
        this.renderer.setSize(width, height);
        this.camera.position.z = 1;

        const evilPearl1 = new EvilPearl(2, 1, this.#arregloMultidimensional, true, new THREE.Vector3(0, 0.801, 0), 6, 1);
        this.scene.add(evilPearl1.getPearl());

        this.#arregloMultidimensional[evilPearl1.getRow()][evilPearl1.getColumn()] = evilPearl1;

        const evilPearl2 = new EvilPearl(0, 2, this.#arregloMultidimensional, true, new THREE.Vector3(0, 0.901, 0), 6, 0);
        this.scene.add(evilPearl2.getPearl());

        this.#arregloMultidimensional[evilPearl2.getRow()][evilPearl2.getColumn()] = evilPearl2;

        //-------------------------------------------------------------------------------------------------------------------
        //                                     Objetos de prueba
        //-------------------------------------------------------------------------------------------------------------------

        // const evilPearl3 = new EvilPearl(2, 1, this.#arregloMultidimensional, false, new THREE.Vector3(0, -0.901, 0), 6, 18);
        // this.scene.add(evilPearl3.getPearl());
        // this.#arregloMultidimensional[evilPearl3.getRow()][evilPearl3.getColumn()] = evilPearl3;

        // const evilPearl4 = new EvilPearl(2, 2, this.#arregloMultidimensional, false, new THREE.Vector3(0, -0.801, 0), 6, 17);
        // this.scene.add(evilPearl4.getPearl());
        // this.#arregloMultidimensional[evilPearl4.getRow()][evilPearl4.getColumn()] = evilPearl4;

        // const evilPearl5 = new EvilPearl(2, 1, this.#arregloMultidimensional, false, new THREE.Vector3(-0.201, -0.901, 0), 4, 18);
        // this.scene.add(evilPearl5.getPearl());
        // this.#arregloMultidimensional[evilPearl5.getRow()][evilPearl5.getColumn()] = evilPearl5;

        // const evilPearl6 = new EvilPearl(3, 2, this.#arregloMultidimensional, false, new THREE.Vector3(-0.201, -0.801, 0), 4, 17);
        // this.scene.add(evilPearl6.getPearl());
        // this.#arregloMultidimensional[evilPearl6.getRow()][evilPearl6.getColumn()] = evilPearl6;

        // const evilPearl7 = new EvilPearl(3, 1, this.#arregloMultidimensional, false, new THREE.Vector3(0.201, -0.601, 0), 8, 15);
        // this.scene.add(evilPearl7.getPearl());
        // this.#arregloMultidimensional[evilPearl7.getRow()][evilPearl7.getColumn()] = evilPearl7;

        // const evilPearl8 = new EvilPearl(2, 2, this.#arregloMultidimensional, false, new THREE.Vector3(0.201, -0.501, 0), 8, 14);
        // this.scene.add(evilPearl8.getPearl());
        // this.#arregloMultidimensional[evilPearl8.getRow()][evilPearl8.getColumn()] = evilPearl8;

        this.#pearls.push(evilPearl1);
        this.#pearls.push(evilPearl2);

        const loader = new THREE.TextureLoader();
        const texture = loader.load('./japan.jpg');
        this.scene.background = texture;
    }

    animate = () => {
        if (!this.animacionActiva)
            return
        let keyFlag = false;
        let keyFlagCombo = false;
        let pearlsAdy = [];
        requestAnimationFrame(this.animate);
        const delta = this.#clock.getDelta();
        if (this.#clock.elapsedTime >= 0.5) {
            // if (this.#pearls.length > 0) {
            this.#pearls.forEach((e, i) => {
                e.tick();
                //Evaluarr si todos estan con getKeyFalse    
                if (e.getKeyBoardFlag())
                    keyFlag = true
            });

            if (!keyFlag) {
                //Detectar Combos
                pearlsAdy = this.#pearls[0].detectCombos();

                if (pearlsAdy.length > 0) {
                    //Eliminar perlas cuadno tenga adyacentes
                    for (let i = 0; i < pearlsAdy.length; i++) {
                        let arrInt = pearlsAdy[i];
                        for (let k = 0; k < arrInt.length; k++) {
                            //Eliminar objetos
                            let evilPearlRemove = this.#arregloMultidimensional[arrInt[k].y][arrInt[k].x].getPearl()
                            this.scene.remove(evilPearlRemove);
                            evilPearlRemove.geometry.dispose();
                            evilPearlRemove.material.dispose();

                            //Limpiar espacio en el arrglo
                            this.#arregloMultidimensional[arrInt[k].y][arrInt[k].x] = null;
                        }
                    }

                    while (!keyFlagCombo) {
                        //Mover las siguientes perlass
                        for (let i = 18; i > 0; i--) {
                            for (let j = 0; j < 13; j++) {
                                let evilPearlRemove = this.#arregloMultidimensional[i][j];
                                if (evilPearlRemove !== null) {

                                    evilPearlRemove.setMoveDownAfterCombos(true);
                                    evilPearlRemove.setKeyBoardFlag(true);

                                    let downValue = null;
                                    if (evilPearlRemove.getRow() < 18) {
                                        downValue = this.#arregloMultidimensional[i + 1][j];

                                        if (downValue === null) {
                                            evilPearlRemove.getPearl().position.y -= 0.100;
                                            let objRefAux1 = this.#arregloMultidimensional[evilPearlRemove.getRow()][evilPearlRemove.getColumn()];
                                            this.#arregloMultidimensional[evilPearlRemove.getRow()][evilPearlRemove.getColumn()] = null;
                                            evilPearlRemove.setRow(1);
                                            this.#arregloMultidimensional[evilPearlRemove.getRow()][evilPearlRemove.getColumn()] = objRefAux1;

                                        } else {
                                            evilPearlRemove.setMoveDownAfterCombos(false);
                                            evilPearlRemove.setKeyBoardFlag(false);

                                        }

                                    }
                                    else {
                                        evilPearlRemove.setMoveDownAfterCombos(false);
                                        evilPearlRemove.setKeyBoardFlag(false);

                                    }
                                }
                            }
                        }

                        keyFlagCombo = true;

                        //Comprobar que ya no se mueve nada
                        for (let i = 0; i < 19; i++) {
                            for (let k = 0; k < 13; k++) {
                                let data = this.#arregloMultidimensional[i][k];
                                if (data !== null)
                                    if (data.getKeyBoardFlag())
                                        keyFlagCombo = false;
                            }
                        }
                    }
                    //this.animacionActiva = false;
                }
                else {
                    //Generar perlas
                    const numeroAleatorio1 = Math.floor(Math.random() * 4);
                    const numeroAleatorio2 = Math.floor(Math.random() * 4);
                    const evilPearl1 = new EvilPearl(numeroAleatorio1, 1, this.#arregloMultidimensional, true, new THREE.Vector3(0, 0.801, 0), 6, 1);
                    this.scene.add(evilPearl1.getPearl());

                    this.#arregloMultidimensional[evilPearl1.getRow()][evilPearl1.getColumn()] = evilPearl1;

                    const evilPearl2 = new EvilPearl(numeroAleatorio2, 2, this.#arregloMultidimensional, true, new THREE.Vector3(0, 0.901, 0), 6, 0);
                    this.scene.add(evilPearl2.getPearl());

                    this.#arregloMultidimensional[evilPearl2.getRow()][evilPearl2.getColumn()] = evilPearl2;

                    this.#pearls.push(evilPearl1);
                    this.#pearls.push(evilPearl2);
                }
            }

            this.#clock.start();
            // }
        }

        this.renderer.render(this.scene, this.camera);
    }

    start() {
        this.animate();
    }
}

export { World };