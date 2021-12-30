import { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, signInWithEmailAndPassword ,onAuthStateChanged} from "../../config/firebase";
import { useNavigate } from "react-router";
import { db, get, ref, onValue } from "../../config/firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const login = (e) => {
    e.preventDefault();
    let obj = {
      email,
      password,
    };
    signInWithEmailAndPassword(auth, obj.email, obj.password)
      .then((succes) => {
        console.log("User Sign In Successfully ", succes);
        const refrence = ref(db, `/users/${succes.user.uid}`);

        setEmail("");
        setPassword("");
        navigate("/Home", { state: obj });
      })
      .catch((err) => {
        
        console.log(err.message);
      });
    console.log(obj);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/Home");
      }
    });
  }, []);

  return (
    <div class="row">
      <div className="col-md-3 center">
        <center>
          <h2
            style={{
              color: "white",
              marginLeft: "650px",
              width: 300,
              marginTop: "150px",
              fontWeight: "bold",
            }}
          >
            ADMIN LOGIN
          </h2>
        </center>
        <form className="set" onSubmit={(e) => login(e)}>
          <fieldset>
            <div class="form-group">
              <center>
                <label
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    marginTop: "20px",
                  }}
                  for="exampleInputEmail1"
                >
                  Admin ID
                </label>
              </center>
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                class="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                required="required"
              />
            </div>
            <div class="form-group">
              <center>
                <label
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    marginTop: "20px",
                  }}
                  for="exampleInputPassword1"
                  className="set1"
                >
                  Password
                </label>
              </center>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                class="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
                required="required"
              />
            </div>
            <button
              type="submit"
              style={{ marginTop: "15px", width: "400px", fontSize: 20 }}
              class="btn btn-primary"
            >
              Login
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default Login;
