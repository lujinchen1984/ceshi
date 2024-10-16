import React, { useEffect,useState } from 'react'
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
//导入hdr图像加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";//rebe加载器
import './index.css'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import {
    CSS2DRenderer,
    CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

export default function DataView() {
    var orbitControls=null
    const scene=new THREE.Scene()
    const [width,setWidth]=useState(window.innerWidth)
    const [height,setHeight]=useState(window.innerHeight-120)
    //相机参数
    const width_canvas=width
    const height_canvas=height  
    const camera=new THREE.PerspectiveCamera(60,width_canvas / height_canvas,1,10000)
    useEffect(()=>{
        
        initSence(scene,width,height)
        initModel(scene)
        
        return()=>{
            
            
        }
    },[window.innerWidth,window.innerHeight])

    //初始化场景
    function initSence(scene){   

        const renderer=new THREE.WebGLRenderer({
            canvas:document.getElementById('containercanvas')
        })
        renderer.setSize(width_canvas , height_canvas)
        renderer.setClearColor('#000',.5)     
        // //CSS2D渲染器
        const labelRenderer = new CSS2DRenderer();
        //将渲染器的尺寸调整为(width, height).
        labelRenderer.setSize( window.innerWidth, window.innerHeight-120 );
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        document.body.appendChild( labelRenderer.domElement );
  
        //交互      
        let orbitControls=new OrbitControls(camera,labelRenderer.domElement)
        // 创建GUI并添加相机属性
        const gui = new GUI();
        
        gui.add(camera.position, 'x').min(-10).max(10).step(0.01).name('Camera X');
        gui.add(camera.position, 'y').min(-10).max(10).step(0.01).name('Camera Y');
        gui.add(camera.position, 'z').min(-10).max(10).step(0.01).name('Camera Z');

        // 获取GUI div的引用
        var guiDom = gui.domElement;
        
        // 设置CSS样式来调整位置
        guiDom.style.position = 'absolute';
        guiDom.style.left = '20px'; // 根据需要调整到所需的水平位置
        guiDom.style.top = '80px'; // 根据需要调整到所需的垂直位置
        
        // 将GUI添加到你的DOM中
        
        //orbitControls.enableZoom = false;//禁止缩放

        //透视投影相机：相机距离目标观察点距离越远显示越小，距离越近显示越大
        //orbitControls.enableRotate = false; // 禁止旋转
        //相机距离观察目标点极小距离——模型最大状态
        //orbitControls.minDistance = 2000;
        //相机距离观察目标点极大距离——模型最小状态
        // orbitControls.maxDistance = 4000;
        // // 左右旋转范围
        // orbitControls.minAzimuthAngle = -Math.PI/2;
        // orbitControls.maxAzimuthAngle = Math.PI/2;
        orbitControls.enableDamping = true
        orbitControls.dampingFactor = 0.03
        orbitControls.enablePan = false
        

        
        const animate=function(){
            requestAnimationFrame(animate)
            TWEEN.update()
            renderer.render(scene,camera)
            orbitControls.update()
            labelRenderer.render(scene,camera)

            
            
        }
        camera.position.set(0,0,3000)
        camera.layers.enableAll();
        
    
    
    
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
        animate()

        window.addEventListener('dblclick', mouseClick, false)
        function mouseClick(event) {
            console.log('dclick')
            // 标签对象和直线
            let tagLabel;
            let tagLine;
            console.log(camera.position.x,camera.position.y,camera.position.z)
            const raycaster = new THREE.Raycaster();
            const mouse = new THREE.Vector2();     
            // 将鼠标位置转换成归一化设备坐标(-1 到 +1)
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -((event.clientY-65)/ (window.innerHeight-120)) * 2 + 1;           
            // 使用鼠标位置和相机进行射线投射
            raycaster.setFromCamera(mouse, camera);           
            // 计算物体和射线的交点
            const intersects = raycaster.intersectObjects(scene.children);            
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
                // camera.position.set(position.x+normal.x*1000,position.y+normal.y*1000,position.z+normal.z*1000)
                // camera.lookAt(position.x,position.y,position.z)
                //console.log(orbitControls)
                // if(orbitControls!=null){
                //     orbitControls.target.set(position.x,position.y,position.z)
                //     orbitControls.update()
                // }

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
                if (intersects2.length > 0) {
                    // 使用distanceTo方法计算两点之间的距离
                    const distance = position.distanceTo(intersects2[0].point);
                    console.log('偏差：'+distance)
                    // initLabel(line,distance.toFixed(2),startpoint)
                    // 创建标签
                    tagLabel = document.createElement('div');
                    tagLabel.style.position = 'absolute';
                    tagLabel.style.color = 'white';
                    tagLabel.style.padding = '5px';
                    tagLabel.style.background = 'black';
                    tagLabel.style.borderRadius = '5px';
                    tagLabel.textContent = distance.toFixed(2);
                    document.body.appendChild(tagLabel);
                    // 将标签的位置设置为点击的3D位置
                    const coords = intersects2[0].point;
                    tagLabel.style.left = event.clientX+ 'px';
                    tagLabel.style.top = event.clientY + 'px';
                    // 使标签可拖动
                    tagLabel.addEventListener('mousedown', function(event) {
                    event.preventDefault();
                    let offsetX = event.clientX - tagLabel.offsetLeft;
                    let offsetY = event.clientY - tagLabel.offsetTop;
                    function drag(event) {
                        tagLabel.style.left = (event.clientX - offsetX) + 'px';
                        tagLabel.style.top = (event.clientY - offsetY) + 'px';
                    }
                    function stopDrag() {
                        document.removeEventListener('mousemove', drag);
                        document.removeEventListener('mouseup', stopDrag);
                        document.removeEventListener('mouseleave', stopDrag);
                    }
                    document.addEventListener('mousemove', drag);
                    document.addEventListener('mouseup', stopDrag);
                    document.addEventListener('mouseleave', stopDrag);
                    });
                
                    // 计算标签和点击位置之间的直线
                    if (tagLine) {
                    scene.remove(tagLine);
                    }
                    tagLine = new THREE.Line(
                    new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(position.x, position.y, position.z),
                        new THREE.Vector3(position.x, position.y + 0.5, position.z), // 假设标签在点击位置上方0.5单位处
                    ]),
                    new THREE.LineBasicMaterial({ color: 0xffffff })
                    );
                    scene.add(tagLine);
                    
                
                
                

                    
                }
            }
        }

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
    // label
    const initLabel=(object,result,position)=>{
          // //创建 css的里显示的部分
        console.log(position)
        const earthDiv = document.createElement( 'div' );
        earthDiv.className = 'label';
        earthDiv.textContent = result;
        earthDiv.style.backgroundColor = 'yellow';
        earthDiv.style.color = 'blue';
        //创建CSS2DObject实例
        const earthLabel = new CSS2DObject( earthDiv );
        earthLabel.position.set(0,-120,0);
        
        scene.add( earthLabel );
        earthLabel.layers.set( 0 );//设层级
    
    
    
 
    }
    

    
    
    // 监听鼠标移动事件
    
  return (
    <>

    <div id='container'><canvas id='containercanvas' ></canvas></div>
    </>
    
    
  )
}
