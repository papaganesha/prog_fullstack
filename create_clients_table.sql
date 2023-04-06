CREATE TABLE `clientes` (
  `cliente_id` varchar(40) NOT NULL,
  `cpf` varchar(50) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `telefone` varchar(50) NOT NULL,
  `data_criacao` date NOT NULL current_timestamp(),
) 