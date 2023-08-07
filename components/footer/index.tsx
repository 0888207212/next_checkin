const Footer = () => {
  return (
    <div>
      <footer className="bg-slate-100 md:rounded-lg shadow py-5 sm:py-12  dark:bg-gray-800">
        <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
          <div className="text-xs sm:text-sm text-gray-500 max-sm:text-center sm:text-center dark:text-gray-400">
            © 2023
            <a
              href="https://www.google.com/maps/place/To%C3%A0+nh%C3%A0+TTC+Duy+T%C3%A2n"
              className="hover:underline"
            >
              Vietnam, Hanoi, Cau Giay Ward, Duy Tan 19, TTC Building, 11th
              Floor
            </a>
          </div>
          <ul className="flex flex-wrap max-sm:flex-col items-center mt-3 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0 ">
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                +84 (24) 3312-0103
              </a>
            </li>
            <li>
              <a
                href="https://www.vmogroup.com/"
                className="mr-4 hover:underline md:mr-6"
              >
                https://www.vmogroup.com
              </a>
            </li>
            <li>
              <a
                href="https://vmogroup.jp/"
                className="mr-4 hover:underline md:mr-6"
              >
                info@vmogroup.com
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
