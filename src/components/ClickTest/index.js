import React, { useEffect,useState } from 'react'
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
//导入hdr图像加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";//rebe加载器
import './index.css'
export default function ClickTest() {
    const scene=new THREE.Scene()
    const [width,setWidth]=useState(window.innerWidth)
    const [height,setHeight]=useState(window.innerHeight)
    let onPointerMove,onDocumentMouseDown,INTERSECTED,SELECTED,objects=[]
    let raycaster=new THREE.Raycaster()
    let mouse=new THREE.Vector2()
    
    

    useEffect(()=>{
        
        initSence(scene,width,height)
        initModel(scene)

        return()=>{
            window.removeEventListener('mousemove',onPointerMove)
            window.removeEventListener('mousedown',onDocumentMouseDown,false)
        }
    },[window.innerWidth,window.innerHeight])

    //初始化场景
    function initSence(scene,width,height){   
        //相机参数
        const width_canvas=width
        const height_canvas=height
        //const camera=new THREE.PerspectiveCamera(60,width_canvas / height_canvas,1,10000)
        const k = width / height; //canvas画布宽高比
        const s = 2000; // 显示控制系数。
        const camera = new THREE.OrthographicCamera( -s*k, k*s, s, -s, -2000, 2000 );
        camera.position.set(800,800,800)
        
        //场景
        const renderer=new THREE.WebGLRenderer({
            canvas:document.getElementById('containercanvas')
        })
        renderer.setSize(width_canvas , height_canvas)
        renderer.setClearColor('#000',.5)
        // 监听画面变化，更新渲染画面
        window.addEventListener("resize", () => {
            //   console.log("画面变化了");
            // 更新摄像头
            setHeight(window.innerHeight)
            setWidth(window.innerWidth)
            camera.aspect = (window.innerWidth) / (window.innerHeight);
            //   更新摄像机的投影矩阵
            camera.updateProjectionMatrix();
        
            //   更新渲染器
            renderer.setSize(window.innerWidth, window.innerHeight);
            //   设置渲染器的像素比
            renderer.setPixelRatio(window.devicePixelRatio);
            
        });
 
        //辅助坐标系
        const axisHelper=new THREE.AxesHelper(1000)
        scene.add(axisHelper)
        //辅助地面
        const gridHelper=new THREE.GridHelper(1000,10)
        gridHelper.material.opacity=0.2
        gridHelper.material.transparent=false
        gridHelper.rotateX(THREE.MathUtils.degToRad(90))
        scene.background=new THREE.Color("#ccc")
        scene.environment=new THREE.Color("#ccc")
        scene.add(gridHelper)

        //环境光
        const ambiColor="#0c0c0c"
        const ambienLight=new THREE.AmbientLight(ambiColor)
        scene.add(ambienLight)
        //平行光
        const directionLight=new THREE.DirectionalLight(0xFFFFFF,2)
        directionLight.position.set(2000,2000,2000)
        scene.add(directionLight)
        const directionLightHelper=new THREE.DirectionalLightHelper(directionLight,100,0xff0000)
        scene.add(directionLightHelper)
        const orbitControls=new OrbitControls(camera,document.getElementById('containercanvas'))
        
        // //交互
       

        document.addEventListener('mousedown',onDocumentMouseDown,false)
        


        function onDocumentMouseDown(event){
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
        
                // 获取交点的坐标
                const position = intersection.point;
                console.log('Clicked position:', position);
        
                // 获取交点的法向量
                const normal = intersection.face.normal;
                console.log('Clicked normal:', normal);
                var color = 0x0000ff; // 箭头颜色
                // 创建ArrowHelper对象
                var arrow = new THREE.ArrowHelper(normal, position, 100, color); // 1表示箭头的长度为1单位
                
                // 将箭头添加到场景中
                scene.add(arrow);
            }
            
        }

        const animate=function(){
            requestAnimationFrame(animate)
            TWEEN.update()
            renderer.render(scene,camera)
        }
        animate()
     
    }
    const initModel=(scene)=>{        
        //加载数模
        const objLoader=new OBJLoader()
        objLoader.load(
            '/static/mymodel/MH AMG_stp.obj',
            function(object){             
                //object.rotateX(-Math.PI/2)                
                scene.add(object)
                // 设置材质为线框模式
                object.traverse((child) => {
                    if (child.isMesh) {
                    child.material.wireframe = true; // 显示线框
                    }
                });
            },
            function(xhr){
                //console.log((xhr.loaded/xhr.total*100)+'% loaded')
            },
            function(error){
                console.log('an error happend'+error)
            }
        )
        
        
    }

  return (
    <div id='container'><canvas id='containercanvas' ></canvas></div>
    
  )
}
