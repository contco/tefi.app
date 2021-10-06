import { fetchData } from "../commons";
const GP_CONTRACT = "terra103z9cnqm8psy0nyxqtugg6m7xnwvlkqdzm4s4k";


export default async function personHandler({ query: { address } }, res) {
    const data = await fetchData(
        `https://randomearth.io/api/users/addr/${address}/items`,
    );
    const filteredData = data?.data?.items;

    if (filteredData) {
        const items = filteredData.map(({ name, collection, src, token_id }) => ({
            name,
            collection: collection.name,
            src,
            tokenId: token_id,
            nftContract: GP_CONTRACT,
        }))
        const finalData = {
            collection: 'Galactic Punks',
            items
        }
        res.status(200).json(finalData);
    } else {
        res.status(200).json({});
    }
}