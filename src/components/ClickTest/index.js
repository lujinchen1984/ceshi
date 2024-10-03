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
   
    useEffect(()=>{
        
        initSence(scene,width,height)
        initModel(scene)

        return()=>{
            
            window.removeEventListener('dblclick',onDocumentMouseDown,false)
        }
    },[window.innerWidth,window.innerHeight])

    //初始化场景
    function initSence(scene,width,height){   
        //相机参数
        const width_canvas=width
        const height_canvas=height
        const camera=new THREE.PerspectiveCamera(60,width_canvas / height_canvas,1,10000)
        // const k = width / height; //canvas画布宽高比
        // const s = 2000; // 显示控制系数。
        // const camera = new THREE.OrthographicCamera( -s*k, k*s, s, -s, -2000, 2000 );
        camera.position.set(0,0,3000)
        //正交投影照相机
       
         //照相机帮助线
        //var cameraHelper = new THREE.CameraHelper(camera2);
        //scene.add(cameraHelper);
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
        // const ambiColor="#0c0c0c"
        // const ambienLight=new THREE.AmbientLight(ambiColor)
        // scene.add(ambienLight)
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
        // const light = new THREE.HemisphereLight(0xffffff, 0x444444);
        // light.position.set(0, 0, 10000);
        // scene.add(light);
 
        const orbitControls=new OrbitControls(camera,document.getElementById('containercanvas'))       
        //交互      
        document.addEventListener('dblclick',onDocumentMouseDown,false)     
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
                //取第二个交点 
                const intersection1 = intersects[1]; 
                // 获取交点的坐标
                const position = intersection.point;
                const position1 = intersection1.point;
                console.log('Clicked position:', position,position1);
        
                // 获取交点的法向量
                const normal = intersection.face.normal;
                //console.log('Clicked normal:', normal);
                var color = 0x0000ff; // 箭头颜色
                // 创建ArrowHelper对象
                var arrow = new THREE.ArrowHelper(normal, position, 100, color); // 1表示箭头的长度为1单位
                
                // 将箭头添加到场景中
                scene.add(arrow);

                // // 设置目标点，即旋转中心
                // orbitControls.target = position;
                
                // // 更新控制器以反映新的目标点
                // orbitControls.update();
                // //3.创建物体
                // const sphereGeometry = new THREE.SphereGeometry(20)
                
                // const sphereMaterail = new THREE.MeshNormalMaterial()
                // const sphere = new THREE.Mesh(sphereGeometry, sphereMaterail)
                // sphere.position.set(position.x+normal.x*1000,position.y+normal.y*1000,position.z+normal.z*1000)
                // scene.add(sphere)

                // camera.position.set(position.x+normal.x*1000,position.y+normal.y*1000,position.z+normal.z*1000)
                // camera.lookAt(position)

                const targetTween=new TWEEN.Tween(orbitControls.target)
                .to({x:position.x,y:position.y,z:position.z},1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(()=>{
                    orbitControls.update()
                    
                })
                .start()
                const cameraTween=new TWEEN.Tween(camera.position)
                .to({x:position.x+normal.x*1000,y:position.y+normal.y*1000,z:position.z+normal.z*1000},1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(()=>{
                    orbitControls.update()
                    
                })
                .start()
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
        var planegeometry = new THREE.PlaneGeometry(2000, 2000, 10);    
        var planematerial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        var plane = new THREE.Mesh(planegeometry, planematerial);
        // 设置平面位置
        plane.position.set(0, 0, 600);
        scene.add(plane);
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
