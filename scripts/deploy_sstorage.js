async function main() {
   const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
   const simpleStorage = await SimpleStorage.deploy();

   console.log("SimpleStorage deployed to:", simpleStorage.target);
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
