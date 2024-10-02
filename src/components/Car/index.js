import React, { useEffect,useState } from 'react'
import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader'
//导入hdr图像加载器
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";//rebe加载器
import './index.css'
export default function Car(props) {
    const scene=new THREE.Scene()
    
    const [width,setWidth]=useState(window.innerWidth)
    const [height,setHeight]=useState(window.innerHeight)
    let onPointerMove,onDocumentMouseDown,INTERSECTED,SELECTED,objects=[]
    let raycaster=new THREE.Raycaster()
    let mouse=new THREE.Vector2()
    
    

    useEffect(()=>{
        
        initSence(scene,width,height)
        initModel(scene)
        initPoint(scene)
        return()=>{
            window.removeEventListener('mousemove',onPointerMove)
            window.removeEventListener('mousedown',onDocumentMouseDown,false)
        }
    },[window.innerWidth,window.innerHeight])

    //初始化场景
    function initSence(scene,width,height){
        
        //相机参数
        const width_canvas=width/2
        const height_canvas=height/2
        const camera=new THREE.PerspectiveCamera(60,width_canvas / height_canvas,1,10000)
        camera.position.set(0,-5000,1000)
        
        
        

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
            camera.aspect = (window.innerWidth/2) / (window.innerHeight/2);
            //   更新摄像机的投影矩阵
            camera.updateProjectionMatrix();
        
            //   更新渲染器
            renderer.setSize(window.innerWidth/2, window.innerHeight/2);
            //   设置渲染器的像素比
            renderer.setPixelRatio(window.devicePixelRatio);
            
        });
 
        //辅助坐标系
        const axisHelper=new THREE.AxesHelper(1000)
        scene.add(axisHelper)
        //辅助地面
        const gridHelper=new THREE.GridHelper(20000,50)
        gridHelper.material.opacity=0.2
        gridHelper.material.transparent=false
        gridHelper.rotateX(THREE.MathUtils.degToRad(90))
        scene.background=new THREE.Color("#ccc")
        scene.environment=new THREE.Color("#ccc")
        scene.add(gridHelper)
        // //加载背景
        
        // const rgbeLoader = new RGBELoader();
        // //资源较大，使用异步加载
        // rgbeLoader.loadAsync("static/mymodel/room.hdr").then((texture) => {texture.mapping = THREE.EquirectangularReflectionMapping;
        // //将加载的材质texture设置给背景和环境
        //     scene.background = texture;
        //     scene.environment = texture;
        // });
        
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
       
        document.addEventListener('mousemove',onPointerMove)
        document.addEventListener('mousedown',onDocumentMouseDown,false)
        
        function onPointerMove(event){
            const container=document.getElementById('containercanvas')
            let getBoundingClientRect=container.getBoundingClientRect()
            let px=getBoundingClientRect.left
            let py=getBoundingClientRect.top
            mouse.x=((event.clientX-px)/width_canvas)*2-1
            mouse.y=-((event.clientY-py)/height_canvas)*2+1
            //console.log(mouse.x,mouse.y)
            raycaster.setFromCamera(mouse,camera)
            const intersects=raycaster.intersectObjects(scene.children,false)
            
            if(intersects.length>0){
                if(INTERSECTED!= intersects[0].object){
                    //console.log(intersects[0].object)
                    if(INTERSECTED)INTERSECTED.material.color.setHex(INTERSECTED.currentHex)
                    INTERSECTED=intersects[0].object
                    INTERSECTED.currentHex=INTERSECTED.material.color.getHex()
                    INTERSECTED.material.color.setHex('0x93DB70')
                }
            }else {
                if(INTERSECTED)INTERSECTED.material.color.setHex(INTERSECTED.currentHex)
                INTERSECTED=null
            }
            renderer.render(scene,camera)
        }

        function onDocumentMouseDown(event){
            event.preventDefault()
            raycaster.setFromCamera(mouse,camera)
            const intersects=raycaster.intersectObjects(scene.children,false)
            if(intersects.length>0){
                var obj=intersects[0].object
                props.getPname(obj.userData.name)
                const targetTween=new TWEEN.Tween(orbitControls.target)
                .to({x:obj.position.x,y:obj.position.y,z:obj.position.z},1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(()=>{
                    orbitControls.update()
                    console.log(obj.position)
                })
                .start()
                const cameraTween=new TWEEN.Tween(camera.position)
                .to({x:obj.position.x,y:obj.position.y-500,z:obj.position.z},1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .onUpdate(()=>{
                    orbitControls.update()
                    console.log(obj.position)
                })
                .start()
                
                console.log(obj.position)
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

            },
            function(xhr){
                //console.log((xhr.loaded/xhr.total*100)+'% loaded')
            },
            function(error){
                console.log('an error happend'+error)
            }
        )
        
        
    }

    const initPoint=(scene)=>{
        // //正方体
        // var point1=new THREE.SphereGeometry(10)      
        // var pointmaterial=new THREE.MeshBasicMaterial({
        //     color:0xffffff,
            
        // })
        // var point1mesh=new THREE.Mesh(point1,pointmaterial)
        // point1mesh.position.set(-358.7,-746.67,493.45)
        // point1mesh.rotateX(-Math.PI/2)
        // point1mesh.userData={id:1,name:'point1'}
        // scene.add(point1mesh)   
        
        // //纹理加载器
        // let textureLoader=new THREE.TextureLoader()
        // let texture=textureLoader.load("static/mymodel/jinggai.JPG")
        // //在平面上加载图片纹理
        
        // var planeGeometry=new THREE.PlaneGeometry(10,10)
        // var planeMaterial=new THREE.MeshBasicMaterial({
        //     color:0xffffff,
        //     map:texture
        // })
        // let plane=new THREE.Mesh(planeGeometry,planeMaterial)
        // //scene.add(plane)
        function CreatePoint(x,y,z,i,j,k,name){
            let pointgeometry=new THREE.SphereGeometry(3)
            let pointmeaterial=new THREE.MeshBasicMaterial({
                color:0xffff00
            })
            let pointmesh=new THREE.Mesh(pointgeometry,pointmeaterial)
            pointmesh.position.set(x,y,z)
            pointmesh.userData={name:name}
            objects.push(pointmesh)
            scene.add(pointmesh)
            const dir=new THREE.Vector3(i,j,k)
            dir.normalize()
            const origin=new THREE.Vector3(x,y,z)
            const length=100
            const hex=0xffff00
            const arrowHelper=new THREE.ArrowHelper(dir,origin,length,hex)
            scene.add(arrowHelper)
        }
        const xhr=new XMLHttpRequest()
        xhr.open('GET','/static/mymodel/z177mhpoints.csv',true)
        xhr.onload=function(){
            if(xhr.readyState===4&&xhr.status===200){
                const csvData=xhr.responseText
                const rows=csvData.split(/[\r\n]+/)
                const headers=rows[0].split(',')
                const result=[]
                for(let i=1;i<rows.length;i++){
                    const values=rows[i].split(',')
                    const obj={}
                    for(let j=0;j<headers.length;j++){
                        obj[headers[j]]=values[j]
                    }
                    result.push(obj)
                }
                //console.log(result)
                for(let row in result){
                    //console.log(result[row])
                    CreatePoint(result[row].x,result[row].y,result[row].z,result[row].i,result[row].j,result[row].k,result[row].name)
                }
            }
        }
        xhr.send()
        
        

    }

  return (
    <div id='container'><canvas id='containercanvas' ></canvas></div>
    
  )
}
