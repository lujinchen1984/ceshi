import React, {useState} from 'react'
import { Button, Space, Table,Modal,Row,Col,Form,message,Popconfirm ,Image, Divider} from 'antd';
import Car from '../../components/Car'
import Paf_CMM from '../../components/Paf_CMM';
import VMTdata from '../../components/VMTdata';
import Partdata from '../../components/Partdata';
import ClickTest from '../../components/ClickTest';
import Camera from '../../components/Camera';


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
