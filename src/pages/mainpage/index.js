import React, {useState} from 'react'
import { Button, Space, Table,Modal,Row,Col,Form,message,Popconfirm ,Image, Divider} from 'antd';
import Car from '../../components/Car'
import Paf_CMM from '../../components/Paf_CMM';
import VMTdata from '../../components/VMTdata';
import Partdata from '../../components/Partdata';

import Camera from '../../components/Camera';
import ThreeDemo from '../../components/ThreeDemo';


export default function Mainpage() {
  const [Pname,setPname]=useState('')
  function getPname(name){
    setPname(name)
  }
  return (
    <>
      <Camera/>
      
       
    </>
  )
}
