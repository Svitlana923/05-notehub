import css from './Loader.module.css';

export default function Loader() {
  return <div><p className={css.text}>Loading movies, please wait...</p>
</div>
}