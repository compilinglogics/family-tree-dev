import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { setOnlineUser } from '../features/user/userSlice';
import { getLocalStorageData } from '../shared/commonFunction';

const useSocket = () => {
    const socketRef = useRef();
    // Use the WebSocket endpoint, not the API endpoint
    // const BASE_URL = 'wss://fapi.fanzaty.net'; // Note the 'wss://' protocol
    const BASE_URL = "https://backend.rmmbr.me"

    const dispatch = useDispatch();

    useEffect(() => {
        const token = getLocalStorageData('token');

        const socket = io(BASE_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            auth: {
                token: token,
            },
        });

        socket.on('connect', () => {
            console.log('Connected:', socket.id);
        });

        socket.on('disconnect', (reason) => {
            console.log('Disconnected:', reason);
        });

        socket.on('connect_error', (error) => {
            console.error('Connection Error:', error);
        });

        socket.on('onlineUser', (data) => {
            dispatch(setOnlineUser(data));
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, [BASE_URL, dispatch]);

    return socketRef.current;
};

export default useSocket;