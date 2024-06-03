import React from 'react'
import PostAuthor from  '../components/PostAuthor'
import { Link } from 'react-router-dom'
import Thumbnail from '../images/blog22.jpg'
const PostDetail = () => {
  return (
    <section className="post-detail">
      <div className="container post-detail__container">
        <div className=" post-detail__header">
          <PostAuthor/>
          <div className="post-detail__buttons">
            <Link to={`/posts/id/edit`}className='btn sm primary'>Edit</Link>
            <Link to={`/posts/id/delete`}className='btn sm danger'>delete</Link>
          </div>
        </div>
        <h1>This is the post Title!</h1>
        <div className="post-detail__thumbnail">
          <img src={Thumbnail} alt="" />
        </div>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex vitae labore et earum. Dolorum non qui minima hic aut. Cum quia, similique pariatur numquam odit nesciunt laudantium fuga ipsum consequatur sunt non libero neque inventore ea nostrum iste, sint repellendus!
        </p>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi adipisci quod exercitationem hic, ducimus magni consequuntur, ab ut aut maiores quasi doloribus nulla, atque mollitia autem impedit. Nam saepe ducimus consequatur at quisquam perferendis, ea possimus natus suscipit fugit cumque aspernatur molestiae, omnis nemo. Molestiae dignissimos hic libero consequatur illum molestias, maxime obcaecati voluptates voluptatibus!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid accusantium veniam nisi nobis, cupiditate delectus sunt dolore optio, autem molestias doloribus, rerum suscipit perspiciatis? Quibusdam eum quasi saepe, voluptate veniam beatae optio facere nesciunt et omnis rerum dolor sint quo molestias qui ipsum, perspiciatis ratione fugit rem adipisci quisquam. Ipsam, laborum. Quod impedit, harum officiis veniam neque sed possimus deserunt mollitia nostrum, quae ea. Reprehenderit dignissimos animi expedita sunt neque nam, accusantium doloribus distinctio asperiores temporibus saepe, reiciendis officia unde! Tempore est qui quas minima illo ipsam tempora omnis libero? Illo magni molestias neque saepe, laboriosam iure aut eveniet sunt fuga commodi, distinctio dolores. Quam laboriosam minima asperiores nihil quaerat.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Id perferendis facere rerum necessitatibus fuga voluptatum dolorem inventore dolorum aliquid aut!
        </p>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id officia neque consectetur tempore eveniet accusamus hic dolore perspiciatis rerum dolores harum corporis suscipit, autem quidem. Magnam saepe animi ut, dolor esse voluptas. Nisi sit reprehenderit repellat, animi perspiciatis illo mollitia sapiente repellendus enim voluptates iusto voluptatem, aspernatur odit optio laudantium nam deserunt provident molestiae delectus minima ex! Labore animi quae quo eos, ab error, officiis eveniet, voluptates quam corporis hic. Molestias dolor neque ab. Tempore illum tempora reiciendis nulla iusto accusantium consectetur, nemo perferendis! Vel accusantium doloremque consequuntur ipsam quasi quis autem voluptas non asperiores! Nesciunt aut itaque ut repellendus, maxime perspiciatis. Nostrum libero dignissimos culpa quae blanditiis a quos recusandae temporibus necessitatibus, corporis, voluptates beatae enim quo consequuntur vero asperiores optio, voluptas fuga. Facilis harum officiis porro molestias deserunt aspernatur assumenda ducimus mollitia numquam! Modi quia aut mollitia recusandae nulla exercitationem dolores voluptates iure ipsum, alias fugiat ipsa eos pariatur laborum velit voluptatum doloremque necessitatibus obcaecati cumque! Voluptatem iste pariatur praesentium cupiditate veniam quisquam, sapiente doloremque saepe temporibus ut illum veritatis consequatur accusantium non, quo inventore! Odio illo magnam neque mollitia expedita officia fugit aperiam recusandae tempore facilis vitae, laboriosam dignissimos laborum repellat qui error? Sit fugiat at nobis.
        </p>
      </div>
    </section>
  )
}

export default PostDetail