import ItemList from '../components/ItemList';

const Home = props => (
  <>
    <ItemList page={+props.query.page || 1} />
  </>
);

export default Home;