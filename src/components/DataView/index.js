import React, { useEffect,useState } from 'react'
import * as THREE from 'three'
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

export default function DataView() {
    const scene=new THREE.Scene()
    const [width,setWidth]=useState(window.innerWidth)
    const [height,setHeight]=useState(window.innerHeight-120)
    
    
    //相机参数
    const width_canvas=width
    const height_canvas=height  
    const camera=new THREE.PerspectiveCamera(60,width_canvas / height_canvas,1,100000)
    
    useEffect(()=>{
        
        initSence(scene)
        initModel()
        window.addEventListener('dblclick', mouseClick, false)
        return()=>{
            
            
        }
    },[window.innerWidth,window.innerHeight])

    //初始化场景
    function initSence(scene){   
        
        const renderer=new THREE.WebGLRenderer({
            canvas:document.getElementById('containercanvas'),
            alpha: true
        })
        renderer.setSize(width_canvas , height_canvas)
        renderer.setClearColor('#88B9DD',.2)     
        const controls = new ArcballControls( camera, renderer.domElement, scene );
        controls.enableGrid=false
        controls.rotateSpeed=3
        controls.addEventListener( 'change', function () {
            renderer.render( scene, camera );
        } );

        //controls.update() must be called after any manual changes to the camera's transform
        camera.position.set( 3000, 3000, 3000 );
        camera.up.set(0, 0, 1)
        controls.update()
        // 创建GUI并添加相机属性
        const gui = new GUI(); 
        // 添加改变相机位置的按钮
        let eventObj = {
            Camera_X: function(){
                camera.position.set(3000,0,0)
                camera.up.set(0, 1, 0)
                camera.lookAt(0,0,0)
                controls.update()
            },
            Camera_Y: function(){
                camera.position.set(0,3000,0)
                camera.up.set(0, 1, 0)
                camera.lookAt(0,0,0)
                controls.update()
            },
            Camera_Z: function(){
                camera.position.set(0,0,3000)
                camera.up.set(1, 0, 0)
                camera.lookAt(0,0,0)
                controls.update()
            },
            Camera_XYZ: function(){
                camera.position.set(3000,3000,3000)
                camera.up.set(0, 0, 1)
                camera.lookAt(0,0,0)
                controls.update()
            },
           
        }
  
        gui.add(eventObj,"Camera_X").name("X")
        gui.add(eventObj,"Camera_Y").name("Y")
        gui.add(eventObj,"Camera_Z").name("Z")
        gui.add(eventObj,"Camera_XYZ").name("XYZ")
        

        var guiDom = gui.domElement;
        
        // 设置CSS样式来调整位置
        guiDom.style.position = 'absolute';
        guiDom.style.left = '20px'; // 根据需要调整到所需的水平位置
        guiDom.style.top = '80px'; // 根据需要调整到所需的垂直位置

        const animate=function(){
            requestAnimationFrame(animate)    
            renderer.render( scene, camera );
            
            
        }

        // 监听画面变化，更新渲染画面
        window.addEventListener("resize", () => {
            //   console.log("画面变化了");
            // 更新摄像头
            setHeight(window.innerHeight)
            setWidth(window.innerWidth)
            camera.aspect = (window.innerWidth) / (window.innerHeight-120);
            //   更新摄像机的投影矩阵
            camera.updateProjectionMatrix();
        
            //   更新渲染器
            renderer.setSize(window.innerWidth, window.innerHeight-120);
            //   设置渲染器的像素比
            renderer.setPixelRatio(window.devicePixelRatio);
            
        });
 
        //辅助坐标系
        const axisHelper=new THREE.AxesHelper(100)
        scene.add(axisHelper)
        //辅助地面
        const gridHelper=new THREE.GridHelper(10000,30)
        gridHelper.material.opacity=0.2
        gridHelper.material.transparent=false
        gridHelper.rotateX(THREE.MathUtils.degToRad(90))
        //scene.background=new THREE.Color("#88B9DD")
        //scene.environment=new THREE.Color("#88B9DD")
        scene.add(gridHelper)
        //平行光
        const directionLight=new THREE.DirectionalLight(0xFFFFFF,2)
        directionLight.position.set(1000,1000,1000)
        scene.add(directionLight)
        const directionLightHelper=new THREE.DirectionalLightHelper(directionLight,100,0xff0000)
        scene.add(directionLightHelper)
        const directionLight2=new THREE.DirectionalLight(0xFFFFFF,2)
        directionLight2.position.set(1000,1000,-1000)
        scene.add(directionLight2)
        const directionLightHelper2=new THREE.DirectionalLightHelper(directionLight2,100,0xff0000)
        scene.add(directionLightHelper2)
        //创建均匀照明的光源
        const light = new THREE.HemisphereLight(0xffffff, 0x444444);
        light.position.set(0, 0, 10000);
        scene.add(light);  
            
        
        animate()

    }
    function initModel(){

        var planegeometry = new THREE.PlaneGeometry(1000, 1000, 1);    
        var planematerial = new THREE.MeshBasicMaterial({ color: 0xaeb2ae,side: THREE.DoubleSide,transparent: true,opacity: 0,});
        var plane = new THREE.Mesh(planegeometry, planematerial);
        plane.position.set(0, 0, 1);
        scene.add(plane);
    
        plane.name='data'
        const gui2 = new GUI();
        //创建GUI
        gui2.addColor(planematerial, 'color').name('颜色').onChange((color) => {
            planematerial.color.set(color);
        });
        gui2.add(planematerial, 'opacity').min(0).max(1).step(0.01).name('透明度').onChange((value) => {
            planematerial.opacity = value;          
  
          });
        var gui2Dom = gui2.domElement;
    
        // 设置CSS样式来调整位置
        gui2Dom.style.position = 'absolute';
        gui2Dom.style.left = '20px'; // 根据需要调整到所需的水平位置
        gui2Dom.style.top = '220px'; // 根据需要调整到所需的垂直位置
  
        
    }
    function mouseClick(event) {  
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();     
        // 将鼠标位置转换成归一化设备坐标(-1 到 +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;           
        // 使用鼠标位置和相机进行射线投射
        raycaster.setFromCamera(mouse, camera);           
        // 计算物体和射线的交点
        const intersects = raycaster.intersectObjects(scene.children);            
        if (intersects.length > 0) {
            // 取第一个交点
            const intersection = intersects[0];    
            console.log(intersects[0])
            if (intersects[0].object.name=='data'){
                const position = intersection.point;
                // 获取交点的法向量
                const normal = intersection.face.normal;
                var color = 0x0000ff; // 箭头颜色
                // 创建ArrowHelper对象
                var arrow = new THREE.ArrowHelper(normal, position, 100, color); // 1表示箭头的长度为1单位
                scene.add(arrow);
            }
           
           
        }
    }
    // 监听鼠标移动事件

    
  return (
    <>

    <div id='container'><canvas id='containercanvas' ></canvas></div>
    </>
    
    
  )
}

