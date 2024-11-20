import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import SoybeanTradeArtifact from './SoybeanTrade.json';
import contractAddress from './contract-address.json'; // Importar o endereço do contrato

const App = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [role, setRole] = useState('');
  const [isTransactionConfirmed, setIsTransactionConfirmed] = useState(false);

  const connectWallet = async () => {
    if (isConnecting) return;

    if (typeof window.ethereum !== 'undefined') {
      setIsConnecting(true);

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        setAccount(accounts[0]);
        setIsWalletConnected(true);
        setErrorMessage('');

        const signer = await provider.getSigner();

        // Carregar dinamicamente o endereço do contrato
        const soybeanTrade = new ethers.Contract(contractAddress.SoybeanTrade, SoybeanTradeArtifact.abi, signer);
        setContract(soybeanTrade);
      } catch (error) {
        if (error.code === -32002) {
          setErrorMessage("Já existe uma solicitação de conexão em andamento. Por favor, aguarde.");
        } else {
          setErrorMessage("Falha ao conectar a carteira. Verifique as permissões e tente novamente.");
        }
        console.error("Erro ao conectar a carteira:", error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      setErrorMessage("Ethereum wallet não detectada. Por favor, instale o MetaMask.");
    }
  };

  const initiateTransaction = async () => {
    if (!contract) {
      alert("Contrato ainda não carregado corretamente.");
      return;
    }

    if (!recipientAddress || !amount || isNaN(amount)) {
      alert("Por favor, insira um valor válido e um endereço.");
      return;
    }

    try {
      const tx = await contract.initiateTransaction(recipientAddress, ethers.parseEther(amount));
      await tx.wait();
      alert("Transação iniciada. Aguardando confirmação do comprador.");
    } catch (error) {
      console.error("Erro ao iniciar transação:", error);
      alert("Falha ao iniciar a transação.");
    }
  };

  const confirmTransaction = async () => {
    if (!contract) {
      alert("Contrato ainda não carregado corretamente.");
      return;
    }

    try {
      const tx = await contract.confirmTransaction();
      await tx.wait();
      alert("Transação confirmada com sucesso!");

      // Agora, chamamos as funções para verificar o status
      const isBuyerConfirmed = await contract.getIsBuyerConfirmed();
      const isSellerApproved = await contract.getIsSellerApproved();

      if (isBuyerConfirmed && isSellerApproved) {
        setIsTransactionConfirmed(true);
        alert("Ambas as partes confirmaram. A transação será executada.");
      }
    } catch (error) {
      console.error("Erro ao confirmar transação:", error);
      alert("Erro ao confirmar a transação.");
    }
  };

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleBack = () => {
    setRole('');
  };

  return (
    <div>
      <h1>Soybean Trade DApp</h1>
      {isWalletConnected ? (
        <>
          <p>Conta conectada: {account}</p>
          {role ? (
            <>
              <h2>Você está como: {role}</h2>
              <button onClick={handleBack}>Voltar</button>
              {role === "comprador" && (
                <>
                  <h3>Confirmar Transação</h3>
                  <button onClick={confirmTransaction}>Confirmar</button>
                  {isTransactionConfirmed && <p>Transação confirmada! A execução ocorrerá em breve.</p>}
                </>
              )}
              {role === "vendedor" && (
                <>
                  <h3>Iniciar Transação</h3>
                  <label>
                    Endereço de destino:
                    <input
                      type="text"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      placeholder="Endereço da carteira do comprador"
                    />
                  </label>
                  <br />
                  <label>
                    Valor (ETH):
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Valor em ETH"
                    />
                  </label>
                  <br />
                  <button onClick={initiateTransaction}>Iniciar Transação</button>
                </>
              )}
            </>
          ) : (
            <div>
              <h2>Escolha seu papel:</h2>
              <button onClick={() => handleRoleSelection("comprador")}>Comprador</button>
              <button onClick={() => handleRoleSelection("vendedor")}>Vendedor</button>
            </div>
          )}
        </>
      ) : (
        <div>
          <button onClick={connectWallet} disabled={isConnecting}>
            {isConnecting ? "Conectando..." : "Conectar Carteira"}
          </button>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default App;
