import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from './firebase.init';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

const auth = getAuth(app);
function App() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);
    const [registered, setRegisered] = useState(false)

    const handleNameBlur = event => {
        setName(event.target.value)
    }
    const handleEmailBlur = event => {
        setEmail(event.target.value)
    };
    const handlePasswordBlur = event => {
        setPassword(event.target.value)
    };
    const handleRegisterChange = event => {
        setRegisered(event.target.checked)
    }
    const handleFormSubmit = event => {
        //import from bootstrap for valid info
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            return;
        }

        if (!/(?=.*[!@#$&*])/.test(password)) {
            setError("Password should contain at least one special character")
            return;
        }
        setError('')
        setValidated(true);
        //end import validation

        if (registered) {
            signInWithEmailAndPassword(auth, email, password)
                .then(result => {
                    const user = result.user;
                    console.log(user)
                })
                .catch(error => {
                    console.error(error);
                    setError(error.message)
                })
        }
        else {
            createUserWithEmailAndPassword(auth, email, password)
                .then(result => {
                    const user = result.user;
                    console.log(user)
                    setEmail('');
                    setPassword('')
                    verifyEmail();
                    setUserName();
                })
                .catch(error => {
                    console.error(error)
                    setError(error.message)
                })
        }

        event.preventDefault()
    };
    const handleForgetPassword = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("email sent")
            })
    }

    const setUserName = () => {
        updateProfile(auth.currentUser, {
            displayName: name
        })
            .then(result => {
                console.log('updating name')
            })
            .catch(error => {
                console.error(error.message)
            })
    }
    const verifyEmail = () => {
        sendEmailVerification(auth.currentUser)
            .then(() => {
                console.log("email varifiaction sent")
            })
    };
    return (
        <div className='w-50 mx-auto mt-2'>
            <h2 className='text-primary'>Please {registered ? 'Login!!' : 'Register!!'}</h2>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                {!registered && <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control onBlur={handleNameBlur} type="text" placeholder="Enter your name" required />
                    <Form.Control.Feedback type="invalid">
                        Please provide your name.
                    </Form.Control.Feedback>
                </Form.Group>}

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid email.
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
                    <Form.Control.Feedback type="invalid">
                        Please provide a valid password.
                    </Form.Control.Feedback>
                </Form.Group>
                <p className='text-danger'>{error}</p>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check onChange={handleRegisterChange} type="checkbox" label="Already Registered?" />
                </Form.Group>
                <Button onClick={handleForgetPassword} variant='link'>Forget Password?</Button>
                <br />
                <Button variant="primary" type="submit">
                    {registered ? 'Login' : "Register"}
                </Button>
            </Form>
        </div>
    );
};

export default App;