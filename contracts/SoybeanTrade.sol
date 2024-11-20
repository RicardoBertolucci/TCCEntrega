// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SoybeanTrade {

    address public seller;
    address public buyer;
    uint public amount;
    bool public isBuyerConfirmed = false; // Flag para confirmar que o comprador está pronto
    bool public isApprovedBySeller = false; // Flag para confirmar a aprovação do vendedor

    // Evento para notificar o status da transação
    event TransactionInitiated(address seller, address buyer, uint amount);
    event TransactionApproved(address approver, uint amount);
    event TransactionExecuted(address seller, address buyer, uint amount);

    constructor() {
        seller = msg.sender; // Define o vendedor como o criador do contrato
    }

    // Função para o vendedor iniciar a transação
    function initiateTransaction(address _buyer, uint _amount) public {
        require(msg.sender == seller, "Somente o vendedor pode iniciar a transacao");
        require(_buyer != address(0), "Endereco do comprador invalido");
        require(_amount > 0, "Valor deve ser maior que zero");

        buyer = _buyer;
        amount = _amount;

        emit TransactionInitiated(seller, buyer, amount);
    }

    // Função para o comprador confirmar a transação
    function confirmTransaction() public {
        require(msg.sender == buyer, "Somente o comprador pode confirmar a transacao");

        isBuyerConfirmed = true; // O comprador confirma que está pronto para prosseguir
        emit TransactionApproved(buyer, amount);
    }

    // Função para o vendedor aprovar e executar a transação
    function approveTransaction() public {
        require(msg.sender == seller, "Somente o vendedor pode aprovar a transacao");
        require(isBuyerConfirmed, "O comprador ainda nao confirmou a transacao");

        isApprovedBySeller = true; // O vendedor aprova a transação
        emit TransactionApproved(seller, amount);

        // Se ambos confirmaram, executa a transação
        if (isBuyerConfirmed && isApprovedBySeller) {
            executeTransaction();
        }
    }

    // Função para executar a transação
    function executeTransaction() internal {
        require(isBuyerConfirmed && isApprovedBySeller, "Ambas as partes precisam aprovar a transacao");
        require(address(this).balance >= amount, "Saldo insuficiente para realizar a transacao");

        // Transferir o valor para o comprador
        payable(buyer).transfer(amount);

        emit TransactionExecuted(seller, buyer, amount);

        // Resetar o estado para nova transação
        resetTransaction();
    }

    // Função para resetar os dados da transação
    function resetTransaction() internal {
        buyer = address(0);
        amount = 0;
        isBuyerConfirmed = false;
        isApprovedBySeller = false;
    }

    // Função para depositar ETH no contrato
    receive() external payable {}

    // Funções para verificar o status da transação
    function getIsBuyerConfirmed() public view returns (bool) {
        return isBuyerConfirmed;
    }

    function getIsSellerApproved() public view returns (bool) {
        return isApprovedBySeller;
    }
}
