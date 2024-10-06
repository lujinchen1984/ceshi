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
    //相机参数
    const width_canvas=width
    const height_canvas=height
    let orbitControls
    const camera=new THREE.PerspectiveCamera(60,width_canvas / height_canvas,1,10000)
    
    useEffect(()=>{
        
        initSence(scene,width,height)
        initModel(scene)
        window.addEventListener('dblclick', mouseClick, false)
        return()=>{
            window.removeEventListener('dblclick',mouseClick,false)
            
        }
    },[window.innerWidth,window.innerHeight])

    //初始化场景
    function initSence(scene){   
        
        
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
        //scene.add(axisHelper)
        //辅助地面
        const gridHelper=new THREE.GridHelper(1000,10)
        gridHelper.material.opacity=0.2
        gridHelper.material.transparent=false
        gridHelper.rotateX(THREE.MathUtils.degToRad(90))
        scene.background=new THREE.Color("#ccc")
        scene.environment=new THREE.Color("#ccc")
        //scene.add(gridHelper)

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
 
              
        //交互      
        let orbitControls=new OrbitControls(camera,document.getElementById('containercanvas'))
        const animate=function(){
            requestAnimationFrame(animate)
            TWEEN.update()
            renderer.render(scene,camera)
        }
        animate()
     
    }
    const initModel=(scene)=>{    
        var planegeometry = new THREE.PlaneGeometry(2000, 2000, 1);    
        var planematerial = new THREE.MeshBasicMaterial({ color: 0x00ff00,side: THREE.DoubleSide });
        var plane = new THREE.Mesh(planegeometry, planematerial);
        plane.position.set(0, 0, 1.23);
        scene.add(plane);
        var planegeometry1 = new THREE.PlaneGeometry(2000, 2000, 1);    
        var planematerial1 = new THREE.MeshBasicMaterial({ color: 0xff0000,side: THREE.DoubleSide });
        var plane1 = new THREE.Mesh(planegeometry1, planematerial1);
        // 设置平面位置
        plane1.position.set(0, 0, 5);
        scene.add(plane1);
        //加载数模
        const objLoader=new OBJLoader()
        objLoader.load(
            '/static/mymodel/MH AMG_stp.obj',
            function(object){             
                //object.rotateX(-Math.PI/2)                
                //scene.add(object)
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
       // 鼠标点击事件监听
    
    function mouseClick(event) {
        console.log('dclick')
        let orbitControls=new OrbitControls(camera,document.getElementById('containercanvas'))
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
            //const intersection1 = intersects[1]; 
            // 获取交点的坐标
            const position = intersection.point;
            //const position1 = intersection1.point;
            console.log('Clicked position:', position);
            // 使用 distanceTo() 方法计算两点之间的距离
            // var distance = position.distanceTo(position1);
            // console.log(distance)
    
            // 获取交点的法向量
            const normal = intersection.face.normal;
            console.log('Clicked normal:', normal);
            var color = 0x0000ff; // 箭头颜色
            // 创建ArrowHelper对象
            var arrow = new THREE.ArrowHelper(normal, position, 100, color); // 1表示箭头的长度为1单位
            //var arrow1 = new THREE.ArrowHelper(normal, position1, 100, color); // 1表示箭头的长度为1单位
            // 将箭头添加到场景中
            //scene.add(arrow);
            //scene.add(arrow1);

            
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
            //camera.position.set(position.x+normal.x*1000,position.y+normal.y*1000,position.z+normal.z*1000)
            // 创建一条直线
            var startpoint=new THREE.Vector3(position.x+normal.x*-10,position.y+normal.y*-10,position.z+normal.z*-10)
            var endpoint=new THREE.Vector3(position.x+normal.x*10,position.y+normal.y*10,position.z+normal.z*10)
            var lineGeometry = new THREE.BufferGeometry().setFromPoints([startpoint, endpoint]);
            var lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
            var line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
            // 创建射线投射器
            var raycaster2 = new THREE.Raycaster(startpoint, normal);
            
            // 计算交点
            var intersects2 = raycaster2.intersectObjects(scene.children);
            
            // intersects是交点数组，包含了交点的详细信息，如点的位置、面的法线等
            // intersects2.forEach(function(intersect2) {
            //     console.log(intersect2.point); // 输出交点位置
            // });
            if (intersects2.length > 0) {
                console.log(intersects2[0].point)
                // 使用distanceTo方法计算两点之间的距离
                const distance = position.distanceTo(intersects2[0].point);
                console.log('偏差：'+distance)
            }
        }
    }
    
    
    // 监听鼠标移动事件
    
  return (
    <div id='container'><canvas id='containercanvas' ></canvas></div>
    
  )
}
