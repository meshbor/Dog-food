import cn from 'classnames';
import React, { useContext, useEffect,useMemo,useState } from 'react';
import s from './index.module.scss';
import { ReactComponent as Save } from './img/save.svg';
import { ReactComponent as Basket } from './img/basket.svg';
import truck from './img/truck.svg';
import quality from './img/quality.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Rating } from '../Rating/Rating';
import api from '../../utils/api';
import BaseButton from '../BaseButton/BaseButton';
import { Form } from '../Form/Form';
import { useForm } from 'react-hook-form';
import { VALIDATE_CONFIG } from '../../constants/constants';
import { UserContext } from '../../context/userContext';


export const Product = ({
  pictures,
  name,
  price,
  discount,
  onProductLike,
  likes = [],
  currentUser,
  description,
  _id,
  reviews,
  onSendReview,
  deleteReview, 
  stock,
  wight,
  author
}) => {

  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [rating,setRating] = useState(5);
  const [counterCart, setCounterCart] = useState(0);
  const [reviewsProduct, setReviewsProduct] = useState([]);

  const { setActiveModal} = useContext(UserContext);

  useEffect(()=>{
    if (reviews) {
      setReviewsProduct(reviews.slice(0, 5));
  }
  },[reviews]);

  
  const discount_price = Math.round(price - (price * discount) / 100);
  const isLike = likes.some((id) => id === currentUser?._id);
 
  let navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  const getUser = (id) => {
    if (!users.length) return "User";
    const user = users.find((el) => el._id === id);
    if (user.avatar.includes('default-image')) {
      return {...user, avatar : 'https://media.istockphoto.com/id/1300845620/ru/%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%BD%D0%B0%D1%8F/%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8C-icon-flat-%D0%B8%D0%B7%D0%BE%D0%BB%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD-%D0%BD%D0%B0-%D0%B1%D0%B5%D0%BB%D0%BE%D0%BC-%D1%84%D0%BE%D0%BD%D0%B5-%D1%81%D0%B8%D0%BC%D0%B2%D0%BE%D0%BB-%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D1%82%D0%B5%D0%BB%D1%8F-%D0%B8%D0%BB%D0%BB%D1%8E%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8F-%D0%B2%D0%B5%D0%BA%D1%82%D0%BE%D1%80%D0%B0.jpg?s=612x612&w=0&k=20&c=Po5TTi0yw6lM7qz6yay5vUbUBy3kAEWrpQmDaUMWnek='}
    }
    return user;
  };

  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const reviewRegister = register('text', {
    required: {
      value: true,
      message: VALIDATE_CONFIG.requiredMessage,
    },
    minLength: { value: 5, message: 'Минимум 5 символов' },
  });

  const sendReview = (data) => {
    onSendReview({...data, rating});
    setShowForm(false);
  };

  const handleCart = () => {
    const goods = localStorage.getItem('goods');
    if (!goods) {
      localStorage.setItem('goods', JSON.stringify([{ name, counterCart }]));
    } else {
      localStorage.setItem(
        'goods',
        JSON.stringify([...JSON.parse(goods), { name, counterCart }])
      );
    }
  };

  const showMore = () => {
    setReviewsProduct((state) => [...reviews.slice(0, state.length + 2)]);
  };
  const hideReview = () => {
    setReviewsProduct((state) => [...reviews.slice(0, 2)]);
  };
  
  // const ratingCount = useMemo(() => Math.round(reviews.reduce((acc, r) => acc = acc + r.rating, 0)/reviews.length), [reviews])

  useEffect(()=>{
    api.getUsers().then((data)=>setUsers(data))
  },[]);


  return (
    <>
      <div>
        <button onClick={handleClick} className='btn'>
          Назад
        </button>
        <h1 className={s.productTitle}>{name}</h1>
        <div className={s.rateInfo}>
          <span> Артикул : <b>{_id}</b> </span>
          <Rating isEditable={true} rating={rating} setRating={setRating}/>
          <span className={s.reviewsCount}>{reviews?.length} отзывов</span>
        </div>
      </div>
      <div className={s.product}>
        <div className={s.imgWrapper}>
          <img src={pictures} alt={`Изображение ${name}`} />
        </div>
        <div className={s.desc}>
          <span className={discount ? s.oldPrice : s.price}>
            {price}&nbsp;₽
          </span>
          {!!discount && (
            <span className={cn(s.price, 'card__price_type_discount')}>
              {discount_price}&nbsp;₽
            </span>
          )}
          <div className={s.btnWrap}>
            <div className={s.left}>
              <button className={s.minus} onClick={() =>
                  counterCart > 0 && setCounterCart(counterCart - 1)
                }>-</button>
              <span className={s.num}>{counterCart}</span>
              <button className={s.plus} onClick={() =>
                  stock > counterCart && setCounterCart(counterCart + 1)
                }>+</button>
            </div>
            <button href='/#' className={cn('btn', 'btn_type_primary', s.cart)}
            onClick={handleCart} >
              В корзину
            </button>
          </div>
          <button
            className={cn(s.favorite, { [s.favoriteActive]: isLike })}
            onClick={onProductLike}
          >
            <Save />
            <span>{isLike ? 'В избранном' : 'В избранное'}</span>
          </button>
          <div className={s.delivery}>
            <img src={truck} alt='truck' />
            <div className={s.right}>
              <h3 className={s.name}>Доставка по всему Миру!</h3>
              <p className={s.text}>
                Доставка курьером — <span className={s.bold}>от 399 ₽</span>
              </p>
            </div>
          </div>
          <div className={s.delivery}>
            <img src={quality} alt='quality' />
            <div className={s.right}>
              <h3 className={s.name}>Доставка по всему Миру!</h3>
              <p className={s.text}>
                Доставка курьером — <span className={s.bold}>от 399 ₽</span>
              </p>
            </div>
          </div>
          {/* <Link to={`/edit-products/${_id}`} >
                <button className={cn('btn', 'btn_type_primary', s.cart)}>Редактировать ваш товар ✂</button>
          </Link> */}
            {author?._id == currentUser?._id && <Link to={`/edit-products/${_id}`} >
                <button className={cn('btn', 'btn_type_primary', s.cart)}>Редактировать ваш товар ✂</button>
          </Link>}
        </div>
      </div>
      <div className={s.box}>
        <h2 className={s.title}>Описание</h2>
        <p className={s.subtitle}>{description}</p>
        <h2 className={s.title}>Характеристики</h2>
        <div className={s.grid}>
          <div className={s.naming}>Вес</div>
          <div className={s.description}>{wight}</div>
          <div className={s.naming}>Цена</div>
          <div className={s.description}>490 ₽ за 100 грамм</div>
          <div className={s.naming}>Польза</div>
          <div className={s.description}>
            <p>
              Большое содержание аминокислот и микроэлементов оказывает
              положительное воздействие на общий обмен веществ собаки.
            </p>
            <p>Способствуют укреплению десен и жевательных мышц.</p>
            <p>
              Развивают зубочелюстной аппарат, отвлекают собаку во время смены
              зубов.
            </p>
            <p>
              Имеет цельную волокнистую структуру, при разжевывание получается
              эффект зубной щетки, лучше всего очищает клыки собак.
            </p>
            <p>Следует учесть высокую калорийность продукта.</p>
          </div>
        </div>
      </div>
      <div className={s.reviews}>
        <div className={s.reviews__control}>
          <span className={s.reviews__title}>Отзывы</span>
          { reviews.length > 5 && <div className={s.review__hideMore}>
          <span className={s.reviews__more} onClick={showMore}>
            Еще отзывы
          </span>
          <span className={s.reviews__more} onClick={hideReview}>
            Свернуть
          </span> </div>}

          {!showForm ? 
          <button className={s.reviews__btn}
            onClick={()=>setShowForm(true)}
          >Оставить отзыв</button> :
        <Form 
           className={s.form}
           handleFormSubmit={handleSubmit(sendReview)}
           title='Написать отзыв'>

            <div className={s.form__rating}>
            Общая оценка
            <Rating isEditable={true} rating={rating} setRating={setRating}/>
            </div>

          <textarea
            {...reviewRegister}
            className={s.textarea}
            type='text'
            name='text'
            placeholder='Поделитесь впечатлениями о товаре'
          />
          {errors.textarea && (
            <p className='auth__error'>{errors?.textarea?.message}</p>
          )}
          <div className={s.form__btn}>
            <BaseButton type='submit' color={'yellow'}>
              Отправить
            </BaseButton>
          </div>
        </Form>}

        </div>
        {reviewsProduct
        ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((e) => (
          <div key={e.created_at} className={s.review}>
            <div className={s.review__author}>
              <div className={s.review__info}>
              <img src={getUser(e.author)?.avatar} className={s.review__avatar} alt="avatar" />
                <span>{getUser(e.author)?.name ?? 'User'} </span>
                <span className={s.review__date}>
                  {new Date(e.created_at).toLocaleString('ru', options)}
                </span>
                {e.author === currentUser?._id && 
                (<span className={s.basket} onClick={() => deleteReview(e._id)}>
                  <Basket/>
                </span>)}
              </div>
              <Rating rating={e.rating} />
            </div>
            <div className={s.text}>
              <span>{e.text}</span>
            </div>
          </div>))}
      </div>
    </>
  );
};
