import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
    try{
        const userId = req.userId || (await req.auth())?.userId;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User ID not found' });
        }

        console.log('Fetching creations for user:', userId);
        const creations = await sql`select * from creations where user_id = ${userId} order by created_at desc`;
        console.log('Found', creations.length, 'creations');

        res.json({success: true, creations})
    }catch(error){
        console.error('Error getting user creations:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({success: false, message: error.message});
    }
}

export const getPublishedCreations = async (req, res) => {
    try{
        console.log('community req received');
        const creations = await sql`select * from creations where published = true order by created_at desc`;
        console.log('Fetched', creations.length, 'published creations');

        res.json({success: true, creations});

    }catch(error){
        console.error('Error getting published creations:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({success: false, message: error.message})
    }
}


export const toggleLikeCreation = async (req, res) => {
    try{
        const userId = req.userId || (await req.auth())?.userId;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User ID not found' });
        }

        const { id } = req.body;

        const [creation] = await sql`select * from creations where id = ${id}`;
        if(!creation){
            return res.status(404).json({success: false, message: 'Creation not found'})
        }

        const currentLikes = creation.likes || [];
        const userIdStr = userId.toString();

        let updatedLikes;
        let message;

        if(currentLikes.includes(userIdStr)){
            updatedLikes = currentLikes.filter((user) => user !== userIdStr);
            message = 'Creation unliked';
        }else{
            updatedLikes = [...currentLikes, userIdStr]
            message = 'Creation liked'
        }

        const formattedArray = `{${updatedLikes.join(',')}}`

        await sql`update creations set likes = ${formattedArray}::text[] where id = ${id}`;

        res.json({success: true, message});

    }catch(error){
        console.error('Error toggling like:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({success: false, message: error.message})
    }
}
