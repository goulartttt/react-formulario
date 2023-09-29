import axios from 'axios'

const configApi = axios.create({
    baseURL:'http://localhost:3001/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const services = {
    blacklist: async (parms) => {
      const resp = await  configApi.post('/blacklist', parms)
      return resp.data
    },
    coberturas:async (parms)=> {
      const resp =  await configApi.get('/coberturas', parms)
      return resp.data
    },  
    cepRestritos:async (parms)=> {
      const resp =  await configApi.post('/cepRestritos', parms) 
      return resp.data
    },
    salvarCotacao:async (parms)=> {
      const resp =  await configApi.post('salvarCotacoes', parms)    
      return resp.data
    },
    buscaCep:async (parms)=> {
      const resp =  await configApi.get(`https://viacep.com.br/ws/${parms}/json/`)    
      return resp.data
    }
    
};

export default services

