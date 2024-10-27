import React, { useEffect,useState } from 'react'
import * as THREE from 'three'
import { SphereGeometry, CylinderGeometry, Group, Mesh, MeshStandardMaterial } from "three";
import TWEEN from '@tweenjs/tween.js'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';

import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
//导入hdr图像加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";//rebe加载器
import './index.css'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import {
    CSS2DRenderer,
    CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { color } from 'three/examples/jsm/nodes/Nodes.js';
import { func } from 'three/examples/jsm/nodes/code/FunctionNode.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import Stats from 'three/addons/libs/stats.module.js';
export default function DataView() {
    const [width,setWidth]=useState(window.innerWidth)
    const [height,setHeight]=useState(window.innerHeight-120)
    let controls,gui,material,geometry,edgesMaterial
    let planes, planeHelpers;
    let camera, scene, renderer, object, cube;
    let clickPosition,measureParams;
    
    //相机参数
    const width_canvas=width
    const height_canvas=height  
    function initSence(){
        // 初始化场景
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
        gui=new GUI()
        renderer=new THREE.WebGLRenderer({
            canvas:document.getElementById('containercanvas'),
            alpha: true,
            antialias: true, 
            stencil: true
        })
        renderer.setSize(width_canvas , height_canvas)
   
        renderer.setPixelRatio( window.devicePixelRatio );
        
        
        //辅助坐标系
        const axisHelper=new THREE.AxesHelper(100)
        scene.add(axisHelper)
        //辅助地面
        const gridHelper=new THREE.GridHelper(10000,30)
        gridHelper.material.opacity=0.2
        gridHelper.material.transparent=false
        gridHelper.rotateX(THREE.MathUtils.degToRad(90))
        //scene.add(gridHelper)
        const myAxes=new Axes
        //scene.add(myAxes)
        // Stats
        // stats = new Stats();
        // document.body.appendChild( stats.dom );
        // 渲染循环
        // 创建背景色控制器
        renderer.setClearColor(0x888888, 1); 
        const scenegui = gui.addFolder('背景色');
        // 创建一个控制对象
        const backcolor = {
            backgroundColor: 0x888888, // 初始背景颜色设置为白色
            updateBackgroundColor: function () {
            // 使用控制对象中的颜色来更新场景的背景色
            scene.background = new THREE.Color(backcolor.backgroundColor);
            }
        };
        
        // 将控制对象的backgroundColor属性添加到GUI
        scenegui.addColor(backcolor, 'backgroundColor').onChange(backcolor.updateBackgroundColor).name('背景色');
        
    
        
    }
    function initCamera(){
        camera.position.set(3000,3000,3000)
        camera.up.set(0, 0, 1)
        const cameragui = gui.addFolder('相机控制');
        // 添加改变相机位置的按钮
        let eventObj = {
            Camera_X: function(){
                camera.position.set(3000,0,0)
                camera.up.set(0, 0, 1)
                camera.lookAt(0,0,0)
            },
            Camera_Y: function(){
                camera.position.set(0,3000,0)
                camera.up.set(0, 0, 1)
                camera.lookAt(0,0,0)

            },
            Camera_Z: function(){
                camera.position.set(0,0,3000)
                camera.up.set(1, 0, 0)
                camera.lookAt(0,0,0)

            },
            Camera_XYZ: function(){
                camera.position.set(3000,3000,3000)
                camera.up.set(0, 0, 1)
                camera.lookAt(0,0,0)
            },
           
        }
  
        cameragui.add(eventObj,"Camera_X").name("X")
        cameragui.add(eventObj,"Camera_Y").name("Y")
        cameragui.add(eventObj,"Camera_Z").name("Z")
        cameragui.add(eventObj,"Camera_XYZ").name("XYZ")
        

        var guiDom = gui.domElement;
        
        // 设置CSS样式来调整位置
        guiDom.style.position = 'absolute';
        guiDom.style.left = '20px'; // 根据需要调整到所需的水平位置
        guiDom.style.top = '80px'; // 根据需要调整到所需的垂直位置

    }
    function initModel(){
        object = new THREE.Group();
		scene.add( object );
        // 添加物体
        const floorgeometry=new THREE.PlaneGeometry(5000,3000)
        const floormaterial = new THREE.MeshBasicMaterial({ color: 0x4d4d4d,side:THREE.DoubleSide });
        geometry = new THREE.BoxGeometry(1000,1500,1000);
        material = new THREE.MeshStandardMaterial( { color: 0x0000ff, roughness: 0.1, metalness: 0.5} );
        cube = new THREE.Mesh(geometry, material);
        const floor=new THREE.Mesh(floorgeometry, floormaterial);
        cube.position.set(0,0,550)
        floor.position.set(0,0,-10)
        
        scene.add(floor)
        //线框
        const edges=new THREE.EdgesGeometry(geometry)
        edgesMaterial=new THREE.LineBasicMaterial({color:0x00ffff})
        const linemodel=new THREE.LineSegments(edges,edgesMaterial)
        cube.add(linemodel)
        object.add( cube );
        
        // 创建GUI
        
        const Modelgui = gui.addFolder('模型控制');
        Modelgui.addColor(material, 'color').onChange((color) => {
            material.color.set(color);
          }).name('模型颜色');
        Modelgui.addColor(edgesMaterial, 'color').onChange((color) => {
            edgesMaterial.color.set(color);
        }).name('边线颜色');
        Modelgui.add(material, 'metalness', 0, 1).onChange((value) => {
            material.metalness = value;
        }).name('金属度');
        Modelgui.add(material, 'roughness', 0, 1).onChange((value) => {
            material.roughness = value;
        }).name('粗糙度');
        
    
    }
    function initControl(){
        controls = new ArcballControls( camera, renderer.domElement, scene );
        controls.enableGrid=false
        controls.rotateSpeed=3
        controls.addEventListener( 'change', function () {
            renderer.render( scene, camera );
            
        } );
    }
    function initLight(){
        // 创建环境光
        const ambientLight = new THREE.AmbientLight(0x404040,5); // 灰色的环境光
        scene.add(ambientLight);
        //添加平行光并改变其位置
        let directionLight = new THREE.DirectionalLight();
        scene.add(directionLight)
        directionLight.position.set(5000,5000,5000);

		//添加平行光辅助器展示平行光的位置
        let directionLightHelper = new THREE.DirectionalLightHelper(directionLight,1,0xff0000);
        scene.add(directionLightHelper);

        RectAreaLightUniformsLib.init();
        // 创建灯光组
        const LeftlightGroup = new THREE.Group();
        for (let i=1;i<=30;i++){
            const rectLight1 = new THREE.RectAreaLight( 0xffffff, 1, 40, 3000 );
            rectLight1.position.set(  i*200-3000, 1500, 0 );
            rectLight1.lookAt( i*200-3000,0,0)
            LeftlightGroup.add(rectLight1)
            LeftlightGroup.add(new RectAreaLightHelper( rectLight1 ))
        }
        scene.add(LeftlightGroup);
        LeftlightGroup.visible=false
        // 创建灯光组
        const LeftlightGroup2 = new THREE.Group();
        for (let i=1;i<=15;i++){
            const rectLight2 = new THREE.RectAreaLight( 0xffffff, 1, 6000, 40 );
            rectLight2.position.set( 0 , 1500, i*200-1500 );
            rectLight2.lookAt(0,0, i*200-1500)
            LeftlightGroup2.add(rectLight2)
            LeftlightGroup2.add(new RectAreaLightHelper( rectLight2 ))
        }
        scene.add(LeftlightGroup2);
        LeftlightGroup2.visible=false

        const Lightgui = gui.addFolder('斑马灯控制');
        Lightgui.add(LeftlightGroup, 'visible').name('左侧斑垂直斑马灯');
        Lightgui.add(LeftlightGroup2, 'visible').name('左侧斑水平斑马灯');

    }
    class Axes extends Group {
        constructor() {
            super();
            // 坐标轴：圆柱体和圆锥组成一条轴
            const cylinder = new CylinderGeometry(5, 5, 200, 10); 
            const arrow = new CylinderGeometry(0, 15, 20);
            const sphere = new SphereGeometry(10);
            // 材质：RGB对应XYZ
            const red = new MeshStandardMaterial( {color: 0xff0000} ); 
            const green = new MeshStandardMaterial( {color: 0x00ff00} ); 
            const blue = new MeshStandardMaterial( {color: 0x0000ff} ); 
            const gold = new MeshStandardMaterial( {color: "gold"} );
    
            // y轴
            const axes_y = new Group();
            const y_line = new Mesh(cylinder, green); 
            const y_arrow = new Mesh(arrow, green);
            y_arrow.position.y += 100;
            axes_y.add(y_line, y_arrow);
            axes_y.position.y += 100;
    
            // x轴
            const axes_x = new Group();    // group默认的中心点是(0,0,0)
            const x_line = new Mesh(cylinder, red); 
            const x_arrow = new Mesh(arrow, red);
            // 这里只是箭头自身的平移，不会改变group的中心点，所以group的中心点还是(0,0,0)
            x_arrow.position.y += 100.04;
            axes_x.add(x_line, x_arrow);
            axes_x.position.x += 100;
            axes_x.rotation.z = -Math.PI / 2;
    
            // z轴
            const axes_z = new Group();
            const z_line = new Mesh(cylinder, blue); 
            const z_arrow = new Mesh(arrow, blue);
            z_arrow.position.y += 100.04;
            axes_z.add(z_line, z_arrow);
            axes_z.position.z += 100;
            axes_z.rotation.x = Math.PI / 2;
    
            // 原点
            const origin = new Mesh(sphere, gold);
    
            this.add(
                axes_x, 
                axes_y, 
                axes_z, 
                origin
                );
        }
    }
    function initClipping(){
        const params = {

            animate: true,
            planeX: {

                constant: 0,
                negated: false,
                displayHelper: false

            },
            planeY: {

                constant: 0,
                negated: false,
                displayHelper: false

            },
            planeZ: {

                constant: 0,
                negated: false,
                displayHelper: false

            }


        };
        planes = [
            new THREE.Plane( new THREE.Vector3( - 1, 0, 0 ), 0 ),
            new THREE.Plane( new THREE.Vector3( 0, - 1, 0 ), 0 ),
            new THREE.Plane( new THREE.Vector3( 0, 0, - 1 ), 0 )
        ];

        planeHelpers = planes.map( p => new THREE.PlaneHelper( p, 20000, 0xffffff ) );
        planeHelpers.forEach( ph => {

            ph.visible = false;
            scene.add( ph );

        } );
        
        const clippinggui = gui.addFolder( '剖面设置' );
        const Xclip = clippinggui.addFolder( 'X剖面' );
        Xclip.add(renderer, 'localClippingEnabled').onChange((enabled) => {
            if (enabled) {
            material.clippingPlanes = [planes[0]];
            edgesMaterial.clippingPlanes = [planes[0]];
            material.side=THREE.DoubleSide
            } else {
            material.clippingPlanes = [];
            }
        }).name('开启X剖面');
        Xclip.add( params.planeX, 'displayHelper' ).onChange( v => planeHelpers[ 0 ].visible = v ).name('显示辅助面');
        Xclip.add( params.planeX, 'constant' ).min( - 1500 ).max( 1500 ).onChange( d => planes[ 0 ].constant = d ).name('位置调整');
        Xclip.add( params.planeX, 'negated' ).onChange( () => {

            planes[ 0 ].negate();
            params.planeX.constant = planes[ 0 ].constant;

        } ).name('显示反向');
        Xclip.open();

        const Yclip = clippinggui.addFolder( 'Y剖面' );
        Yclip.add(renderer, 'localClippingEnabled').onChange((enabled) => {
            if (enabled) {
            material.clippingPlanes = [planes[1]];
            edgesMaterial.clippingPlanes = [planes[0]];
            material.side=THREE.DoubleSide
            } else {
            material.clippingPlanes = [];
            }
        }).name('开启Y剖面');
        Yclip.add( params.planeY, 'displayHelper' ).onChange( v => planeHelpers[ 1 ].visible = v ).name('显示辅助面');
        Yclip.add( params.planeY, 'constant' ).min( - 1500 ).max( 1500 ).onChange( d => planes[ 1 ].constant = d ).name('位置调整');
        Yclip.add( params.planeY, 'negated' ).onChange( () => {

            planes[ 1 ].negate();
            params.planeX.constant = planes[ 1 ].constant;

        } ).name('显示反向');
        Yclip.open();

        const Zclip = clippinggui.addFolder( 'Z剖面' );
        Zclip.add(renderer, 'localClippingEnabled').onChange((enabled) => {
            if (enabled) {
            material.clippingPlanes = [planes[2]];
            edgesMaterial.clippingPlanes = [planes[0]];
            material.side=THREE.DoubleSide
            } else {
            material.clippingPlanes = [];
            }
        }).name('开启Z剖面');
        Zclip.add( params.planeZ, 'displayHelper' ).onChange( v => planeHelpers[ 2 ].visible = v ).name('显示辅助面');
        Zclip.add( params.planeZ, 'constant' ).min( - 1500 ).max( 1500 ).onChange( d => planes[ 2 ].constant = d ).name('位置调整');
        Zclip.add( params.planeZ, 'negated' ).onChange( () => {

            planes[ 2 ].negate();
            params.planeX.constant = planes[ 2 ].constant;

        } ).name('显示反向');
        Zclip.open();
    }

    // 获取点击位置的函数
    function initMeasure(){
        measureParams = {
            start_measure: false,
        }
        const measuregui = gui.addFolder( '测量选项' );
        measuregui.add(measureParams, 'start_measure').onChange((enabled) => {
            if (enabled) {
                measureParams.start_measure=true
            } else {
                measureParams.start_measure=false
            }
        }).name('开启测量');
        function getClickPosition(event) {
            if(measureParams.start_measure){
                const raycaster = new THREE.Raycaster();
                const mouse = new THREE.Vector2();     
                // 将鼠标位置转换成归一化设备坐标(-1 到 +1)
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -((event.clientY-65)/ (window.innerHeight-120)) * 2 + 1;           
                // 使用鼠标位置和相机进行射线投射
                raycaster.setFromCamera(mouse, camera);           
                // 计算物体和射线的交点
                const intersects = raycaster.intersectObjects([object]);            
                if (intersects.length > 0) {
                    // 取第一个交点
                    const intersection = intersects[0];  
                    // 获取交点的坐标
                    const position = intersection.point;
                    // 获取交点的法向量
                    const normal = intersection.face.normal;
                    //console.log('Clicked normal:', normal);
                    var color = 0x0000ff; // 箭头颜色
                    // 创建ArrowHelper对象
                    var arrow = new THREE.ArrowHelper(normal, position, 100, color); // 1表示箭头的长度为1单位
                    // 将箭头添加到场景中
                    scene.add(arrow);    
                    return  position      
                }else{
                    return null
                }
    
            }

            
        }
        // 通过鼠标按下抬起的时间差或者说距离差，来区分判断是鼠标拖动事件，还是鼠标拖动旋转事件
        let points_dis=[]
        let L
        let mousedownX = 0;
        let mousedownY = 0;
        renderer.domElement.addEventListener('mousedown', function (event) {
            if(measureParams.start_measure){
                mousedownX = event.offsetX;
                mousedownY = event.offsetX;
            }
        })
        renderer.domElement.addEventListener('mouseup', function (event) {
            if(measureParams.start_measure){
                const x = event.offsetX;
                const y = event.offsetX;
                console.log(points_dis)
                if(Math.abs(x-mousedownX)<1 && Math.abs(y-mousedownY)<1){
                    if(points_dis.length<2){
                        if(getClickPosition(event)!=null){
                            points_dis.push(getClickPosition(event))
                            console.log(points_dis)
                            if(points_dis.length==2){
                                console.log(points_dis)
                                L = points_dis[0].distanceTo(points_dis[1]).toFixed(2);                  
                                console.log('L', L);
                                points_dis=[]
                            }
                        }
                        
                        
                    }else{
                        points_dis=[]
                    }          
                }
            }
        })

    }
    function animate() {
        requestAnimationFrame(animate);  
        renderer.render(scene, camera);
        
    }

    
    useEffect(()=>{
        initSence()
        initCamera()
        initControl()
        initLight()
        initModel()
        initClipping()
        initMeasure()
        animate();

        return()=>{
            
            
        }
    },[window.innerWidth,window.innerHeight])

  return (
    <>

    <div id='container'><canvas id='containercanvas' ></canvas></div>
    </>
    
    
  )
}

