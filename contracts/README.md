# Red Packet

A hook for red packet.

1. Users ar purchasing NFT by paying 1 MATIC
2. When they purchase a new "salt" is set on the contract
3. Until the "reveal date" the metadata does not reveal who has won
4. After reveal, each NFT is set to be winning or losing based on the number of sold NFT
5. For this, we hash the token id with the salt and we apply a modulo of number of NFT sold.

Results are assigned in the following order

0: grand winner
1
