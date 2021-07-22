import { useAuth0 } from '@auth0/auth0-react';
import { Form, Button } from 'react-bootstrap';

const Logout = () => {
    const { logout } = useAuth0();
    return (
        <div>
            <Form onSubmit={logout} inline>
                <Button type="submit" variant="outline-primary">Logout</Button>
            </Form>
        </div>
    )
}

export default Logout;
