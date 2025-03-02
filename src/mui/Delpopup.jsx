import { Box, Button, Container, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";
import { AdminButton } from "../../components/mui";
import colors from "../../config/colors";
import useApi from "../../hooks/useApi";
import { Modal, ModalFooter } from 'react-bootstrap'

const Delpopup = ({show,onHide}) => {
    const initial={
        first_name:"",
        last_name:"",
        email:"",
        password:"",
        password2:"",
        phone:"",
        role:"",
        company:"",
        address:"",
        state:"",
      }
      const [data,setData]=useState(initial)
    
        const [message, setMessage] = useState({text:"",color:""});
      
        const navigate=useNavigate()
      function handleChange(key,value){
        setData({...data,[key]:value})
      }
      const {request,error,loading}=useApi((data)=>apiClient.post('/register/',data))
     
        async function handleSubmit(e) {
          e.preventDefault();
         
      
        if(data.password!=data.password2)
        return setMessage({text:"Password doesn't match please enter again",color:"danger"})
        if(data.password.length<6)
        return setMessage({text:"Password should be atleast 6 characters",color:"danger"})
    const {password2,...data2}=data
    //console.log(data)
    
          
        }
      
        function resetErrors() {
          setMessage({text:"",color:""})
        }
        function emptyForm() {
          handleChange(initial)
        }
  return (
    <>
    <Modal
           show={show}
           onHide={onHide}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{ zIndex: "1300" }}
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
               
                Delete User
               
              </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
            <Modal.Body>
                Are You sure you want to delet this user.
          
            </Modal.Body>
            <ModalFooter className="d-flex gap-2">
                <Button onClick={onHide} color="error" type="submit" variant="contained">NO</Button>
                <Button type="submit" variant="contained">Yes</Button>

            </ModalFooter>
            </form>
            </Modal>
    </>
  )
}

export default Delpopup