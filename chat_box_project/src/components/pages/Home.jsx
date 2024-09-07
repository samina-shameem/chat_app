import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Home() {
  const { auth } = useAuth();
  return (
    <div className="container d-flex align-items-center justify-content-center">
      <div className="text-center">
        <h1>Welcome to the Chat Box</h1>
        
        <div className="mt-3">
          {auth?.username ? (
            <>            
              <Link className="btn btn-primary" to="/Chat">
                Goto chat room
              </Link>
            </>
          ) : (
            <>
                <p>Please log in or register to start chatting.</p>
              <Link className="btn btn-primary m-3" to="/login">
                Login
              </Link>
              <Link className="btn btn-primary m-3" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
