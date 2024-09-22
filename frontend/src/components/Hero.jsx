
import { MdOutlineLocalOffer, MdStar } from 'react-icons/md'
import { NavLink } from 'react-router-dom'
import { FaStar } from "react-icons/fa";

function Hero() {
  return (
    <section className='relative bg-hero bg-cover bg-center bg-no-repeat h-screen w-full ' >
        <div className='max_padd_container relative top-32 xs:top-52' >
            <h1 className='h1 capitalize max-w-[37rem]' >Digital Shoping   Hub Junction</h1>
            <p className='text-gray-50 regular-16 mt-6 max-w-[33rem] ' >Discover the latest trends in fashion, clothing, and accessories jflkas
            d jjkl afsjd kljlksdajf klj salkdf jklsjadklf jlkdfs;akfl;sakdfl;kasl;dkfl;sdakfl; kj lkh fd lsjd hshadl hflkdfh as
            sadj lkjs dfhsjak jkhdskjfh jkhdsfkjhkjsdhf jkhdjkfh jkhdsjkf hjkdshf kjhdsjk hjkdfhs jkhdsfjk h
            adflk jlksadj flksjd flkjsalkdf jklsdaj lkjsdlk fjlkasdj </p>


            <div className='flexStart !items-center gap-x-4 my-10 ' >
                <div className='!regular-24 flexCenter gap-x-3' >
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                   
                </div >
                <div className="bold-16 sm:bold-20  ">176k <span className='regular-16 sm:regular-20 ' >Excellent Reviews</span></div>
               
            </div>
            <div className='max-xs:flex-col flex gap-2 ' >
                    <NavLink to={''} className={"btn_dark_rounded flexCenter"} >Shop Now</NavLink >
                    <NavLink to={''} className={"btn_dark_rounded flexCenter gap-x-2 "}> <MdOutlineLocalOffer/> Shop Now</NavLink >

                </div>

        </div>
    </section>
  )
}

export default Hero