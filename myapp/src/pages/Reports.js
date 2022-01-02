import { React } from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { db, set, ref, onChildAdded } from "../config/firebase";
import { v4 as uuidv4 } from "uuid";
import Navbar from  "../comp2/navbar"
<thead>
<tr style={{fontWeight:"bold"}}>
  <th scope="col">CATTLE ID</th>
  <th scope="col">CATTLE NAME</th>
  <th scope="col">CATTLE COLOR</th>
  <th scope="col">INITIAL WEIGHT (kg)</th>
  <th scope="col">CURRENT WEIGHT (kg)</th>
  <th scope="col">STATUS</th>
</tr>
</thead>
function Health() {
  const [CattleID, setCattleID] = useState("");
  const [CattleName, setCattleName] = useState("");
  const [Cattlecolor, setCattlecolor] = useState("");
  const [Temprature, setTemprature] = useState("");
  const [Status, setStatus] = useState("");
  const [userList, setUserList] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  var [updatebutton, setupdatebutton] = useState();

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
  const add = () => {
    let obj = {
      CattleID,
      CattleName,
      Cattlecolor,
      Temprature,
      Status,
      key: updatebutton ? updatebutton : uuidv4(),
    };
    const refrence = ref(
      db,
      `/health/${updatebutton ? updatebutton : obj.key}`
    );

    set(refrence, obj)
      .then(() => {
        console.log("added");
      })
      .catch((err) => {
        console.log(err.message);
      });

    handleClose();
    setupdatebutton();

    setCattleID("");
    setCattleName("");
    setCattlecolor("");
    setTemprature("");
    setStatus("");
  };
  useEffect(() => {
      let refrence = ref(db, "health/");
      let arr = [];
      onChildAdded(refrence, (snapshot) => {
        if (snapshot.exists()) {
          arr.push(snapshot.val());
          setUserList([...arr]);
        }
      });

  }, []);

  let upDate = (data) => {
    setupdatebutton(data.key);

    setCattleID(data.CattleID);
    setCattleName(data.CattleName);
    setCattlecolor(data.Cattlecolor);
    setTemprature(data.Temprature);
    setStatus(data.Status);
    handleOpen();
  };
  return (
    <>
    <Navbar />
    <div className="home">
      <center>
        <h1 style={{ color: "white" }}>Cattle health</h1>
      </center>
      <center>
        <Button style={{ color: "white" }} onClick={handleOpen}>
          ADD Cattle Weight
          <AddCircleOutlineIcon />
        </Button>
        <Modal
          open={open}
          onClose={() => {
            handleClose();
            setupdatebutton();
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Enter New Stock
            </Typography>
            <TextField
              sx={{ mt: 4 }}
              id="outlined-basic"
              label="CattleID"
              variant="outlined"
              value={CattleID}
              onChange={(e) => setCattleID(e.target.value)}
            />

            <TextField
              sx={{ mt: 4 }}
              id="outlined-basic"
              label="CattleName"
              variant="outlined"
              value={CattleName}
              onChange={(e) => setCattleName(e.target.value)}
            />
            <TextField
              sx={{ mt: 2 }}
              id="outlined-basic"
              label="Cattlecolor"
              variant="outlined"
              value={Cattlecolor}
              onChange={(e) => setCattlecolor(e.target.value)}
            />
            <TextField
              sx={{ mt: 2 }}
              id="outlined-basic"
              label="Temprature"
              variant="outlined"
              value={Temprature}
              onChange={(e) => setTemprature(e.target.value)}
            />
            
             <TextField
              sx={{ mt: 2 }}
              id="outlined-basic"
              label="Status"
              variant="outlined"
              value={Status}
              onChange={(e) => setStatus(e.target.value)}
            />
            <br />
            <Button
              onClick={add}
              sx={{
                mt: 2,
              }}
              variant="contained"
            >
              {updatebutton ? "Update" : <AddCircleOutlineIcon />}
            </Button>
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
  <th scope="col">CATTLE ID</th>
  <th scope="col">CATTLE NAME</th>
  <th scope="col">CATTLE COLOR</th>
  <th scope="col">Temprature</th>
  <th scope="col">STATUS</th>
</tr>
          {userList.map((e, i) => {
            return (
              <tr key={i}>
                <td>{e.CattleID}</td>
                <td>{e.CattleName}</td>
                <td>{e.Cattlecolor}</td>
                <td>{e.Temprature}</td>
                <td>{e.Status}</td>
                <td>
                  <button onClick={() => upDate(e)}>Update</button>
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
export default Health;
