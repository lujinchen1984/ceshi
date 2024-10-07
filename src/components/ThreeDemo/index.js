import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
let camera = null; //相机
let scene = null; //场景
let renderer = null; //渲染器
let container = null; //three挂载对象
let controls = null; //控件
function ThreeDemo() {
  //初始加载场景
  const createtHREE = () => {
    //新建场景
    scene = new THREE.Scene();
    //新建一个相机（相当于眼睛，只有有了眼睛才能视物）
    camera = new THREE.PerspectiveCamera(
      75,
      ((3 / 4) * window.innerWidth) / ((3 / 4) * window.innerHeight),
      0.1,
      1000
    );
    //将相机放入合适的位置
 
    camera.position.set(30, 30, 50)
    camera.lookAt(0,0,0)
    // 生成渲染器
    renderer = new THREE.WebGLRenderer();
    renderer.setSize((3 / 4) * window.innerWidth, (3 / 4) * window.innerHeight);
    renderer.setClearColor('#888', 0.5); //背景颜色
    container = document.getElementById('container');
    container.appendChild(renderer.domElement); //生成的渲染的实例, 这个要放到对应的dom容器里面
    controls = new OrbitControls(camera, renderer.domElement);
 
    addGeo();
    addPlant();
    animate();
  };
 
  //生成几何体
  const addGeo = () => {
    const geometry = new THREE.BoxGeometry(10, 10, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
  };
   //生成平面
   const addPlant = () => {
    let plantGeo = new THREE.PlaneGeometry(60, 60, 1, 1);
    const plantMaterial = new THREE.MeshLambertMaterial({
      color: 'pink',
    });
    const plane = new THREE.Mesh(plantGeo, plantMaterial);
    plane.receiveShadow = true;
    // 设置平面位置
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    scene.add(plane);
  };
  //
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
 
  useEffect(() => {
    createtHREE();
  }, []);
 
  return (
    <div>
      <div id="container"></div>
    </div>
  );
}
 
export default ThreeDemo;