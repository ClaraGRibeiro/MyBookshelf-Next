"use client";

const Footer = () => {
  return (
    <footer className="w-full absolute bottom-0 h-8 dark:bg-[var(--medium-slate)] bg-[var(--dark-slate)] flex justify-center items-center px-12 text-[var(--light-slate)]">
      <p className="font-semibold text-sm">
        {new Date().getFullYear()} &copy;{" "}
        <a href="https://www.linkedin.com/in/clara-gon%C3%A7alves-ribeiro-66b07a213/">
          Clara Ribeiro
        </a>
      </p>
    </footer>
  );
};

export default Footer;
