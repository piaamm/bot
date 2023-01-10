import GetHeaders from './GetHeaders';
import axios from 'axios';

export default async (Token, Proxy) => {
    const [Host, Port, Username, Password] = Proxy.split(':');
    const Headers: any = await GetHeaders(Token, Proxy);
    
    if (!Headers) return false;

    return axios.get('https://discord.com/api/v9/users/@me', {
        proxy: {
            host: Host,
            port: Port,
            auth: {
                username: Username ?? '',
                password: Password ?? ''
            }
        },
        headers: Headers
    })
        .then((Result) => Result?.status === 200)
        .catch(() => false);
};