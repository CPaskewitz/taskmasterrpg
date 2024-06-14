import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    component: React.ComponentType<any>;
    path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, path, ...rest }) => {
    const isAuthenticated = !!localStorage.getItem('token');
    return (
        <Routes>
            <Route
                path={path}
                element={
                    isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />
                }
            />
        </Routes>
    );
};

export default PrivateRoute;