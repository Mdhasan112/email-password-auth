import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import app from './firebase.init';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

const auth = getAuth(app);
function App() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('')
    const [password, setPassword] = useState('');
    const [validated, setValidated] = useState(false);

    const handleEmailBlur = event => {
        setEmail(event.target.value)
    };
    const handlePasswordBlur = event => {
        setPassword(event.target.value)
    };
    const handleFormSubmit = event => {
        //import from bootstrap for valid info
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            return;
        }

        if(!/(?=.*[!@#$&*])/.test(password)) {
            setError("Password should contain at least one special character")
            return;
        }
        setError('')
        setValidated(true);
        //end import validation

        createUserWithEmailAndPassword(auth, email, password)
            .then(result => {
                const user = result.user;
                console.log(user)
            })
            .catch(error => {
                console.error(error)
            })
        event.preventDefault()
    }
    return (
        <div className='w-50 mx-auto mt-2'>
            <h2 className='text-primary'>Please Register</h2>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
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
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default App;