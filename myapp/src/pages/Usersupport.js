import { React } from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
 import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState } from "react";
import { Link } from "react-router-dom";
import { auth, createUserWithEmailAndPassword } from "../config/firebase";
import {  db, set, ref, onChildAdded,remove,  } from "../config/firebase";
import Navbar from "../comp2/navbar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [userList, setUserList] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const signUp = (e) => {
    e.preventDefault();
    let obj = {
      name,
      email,
      password,
    };
    createUserWithEmailAndPassword(auth, obj.email, obj.password)
      .then((res) => {
        let uid = res.user.uid;
        console.log(uid);
        obj.uid = uid;
        const refrence = ref(db, `/users/${obj.uid}`);
        set(refrence, obj).then(() => {
          setEmail("");
          setPassword("");
          setName("");
          alert("user created Successfully");
        });
      })
      .catch((err) => {
        console.log(err.message);
      });

    console.log(obj);
  };
  useEffect(() => {
    let refrence = ref(db, "users/");
    let arr = [];
    onChildAdded(refrence, (snapshot) => {
      if (snapshot.exists()) {
        arr.push(snapshot.val());
        setUserList([...arr]);
      }
    });

}, []);
const deleteUser = (uid) => {
  const refrence = ref(db, "users/" + uid);
  remove(refrence);
};
console.log(ref)
  return (
    <>
      <Navbar />
      <div className="home">
     
      <center>
        <h1 style={{ color: "white" }}>Userinfo</h1>
      </center>
      <center>
        <Button style={{ color: "white" }} onClick={handleOpen}>
          ADD 
          <AddCircleOutlineIcon />
        </Button>
        <Modal
          open={open}
          onClose={() => {
            handleClose();
           
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
          <form onSubmit={(e) => signUp(e)}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Enter user
            </Typography>
           
            <TextField
              value={name}
              placeholder="Enter User Name"
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              value={email}
              placeholder="Enter Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <TextField
              value={password}
              placeholder="Enter Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button value="Sign Up"  variant="contained" type="submit"> 
              <AddCircleOutlineIcon />
              </button>
              </form>
          </Box>
        </Modal>
      </center>
      <table
        class="table"
        style={{
          color: "white",
          marginLeft: "100px",
          marginTop: "80px",
          backgroundColor: "black",
          boxShadow: "2px 3px 4px white",
        }}
      >
       <thead>
<tr style={{fontWeight:"bold"}}>
  <th scope="col">Name</th>
  <th scope="col">Email</th>

 
</tr>
          {userList.map((e, i) => {
            return (
              <tr key={i}>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>
                <IconButton
                        onClick={() => deleteUser(e.uid)}
                        aria-label="delete"
                        color="primary"
                      >
                        <DeleteIcon />
                      </IconButton>
                  </td>
                
               
              </tr>
            );
          })}
        </thead>
      </table>
   
    
    </div>
    </>
  );
}
export default SignUp;