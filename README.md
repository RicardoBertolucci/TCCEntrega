# TCC - Sistema de Rastreabilidade de Soja com Blockchain

Este repositório contém o projeto de TCC desenvolvido por **Ricardo Zampolo Bertolucci Cruz** como parte do curso de **[nome do curso]**.

## Objetivo
O objetivo deste projeto é criar um sistema de rastreabilidade de soja utilizando blockchain, proporcionando uma maneira segura e transparente de monitorar a cadeia de suprimentos desde a produção até o consumidor final.

## Tecnologias Utilizadas
- **React**: Framework utilizado para o frontend.
- **Hardhat**: Framework para desenvolvimento de contratos inteligentes em Ethereum.
- **Solidity**: Linguagem para criação de contratos inteligentes.
- **TypeScript**: Para tipagem estática no frontend.
- **Node.js**: Para execução de backend e interações com blockchain.

## Como Rodar
1. Clone este repositório:
    ```bash
    git clone https://github.com/RicardoBertolucci/TCCEntrega.git
    ```

2. Instale as dependências do frontend:
    ```bash
    cd TCCEntrega/frontend
    npm install
    ```

3. Para rodar o projeto:
    ```bash
    npm start
    ```

4. Para testar os contratos inteligentes, utilize Hardhat:
    ```bash
    npx hardhat run scripts/deploy.js
    ```

## Contribuições
Contribuições são bem-vindas! Para contribuir, faça um fork do repositório e envie um pull request com suas alterações.

## Licença
Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
