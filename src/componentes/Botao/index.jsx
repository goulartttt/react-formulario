import React,{ useContext } from 'react';
import FormularioContext from '../../context/formularioContext';
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import services from '../../services';


const Botao = () => {
    const {inputs, setInputs, disabledBotao} = useContext(FormularioContext)

    async function salvarCotacao() {      
        try {
            if (!inputs.proponente || !inputs.cpf || !inputs.cep || !inputs.estado ||
                !inputs.cidade || !inputs.logradouro || !inputs.bairro ||!inputs.numero ||
                 !inputs.cobertura || !inputs.valor_premio ||!inputs.inicio_vigencia ||
                 !inputs.fim_vigencia) {
                return toast("Preencha os campos obrigatorios")
            }            
            const salvarInputs = {
                nome: inputs.proponente,
                cpf: inputs.cpf,
                endereco: {
                    cep: inputs.cep,
                    estado: inputs.estado,
                    cidade: inputs.cidade,
                    logradouro: inputs.logradouro,
                    bairro: inputs.bairro,
                    complemento: inputs.complemento,
                    numero: inputs.numero
                },
                coberturas: inputs.cobertura,
                valorPremio: inputs.valor_premio,
                inicioVigencia: inputs.inicio_vigencia,
                fimVigencia: inputs.fim_vigencia
            }

            const resp = await services.salvarCotacao(salvarInputs);
            if (resp.success) {
                limpaFormulario()
                toast("Cotação salva com sucesso")  
            } else {
               toast("Erro ao salvar cotação") 
            }
    
        } catch (error) {
            console.log(error)
        }
        
      }
       //Limpa Formulario
    function limpaFormulario() {
        setInputs({
            ...inputs,
            proponente :'',
            cpf:'',
            inicio_vigencia:'',
            fim_vigencia:'',
            dias_vigencia:'',
            cep:'',
            estado:'',
            cidade:'',
            logradouro:'',
            bairro:'',
            complemento:'',
            numero:'',
            cobertura:'',
            valor_premio:''
        })
    }

    return (
        <>
            <Button disabled={disabledBotao} onClick={(e) => salvarCotacao(e)}>Enviar Cotação</Button>
        </>
    )
}

export default Botao