"use client";

export default function Footer() {
  return (
    <footer className="w-full fixed bottom-0 h-8 dark:bg-(--medium-slate) bg-(--dark-slate) flex justify-center items-center px-12 text-(--light-slate)">
      <p className="text-sm">
        {new Date().getFullYear()} &copy;{" "}
        <a
          href="https://www.linkedin.com/in/clara-gon%C3%A7alves-ribeiro-66b07a213/"
          target="_blank"
        >
          Clara Ribeiro
        </a>
      </p>
    </footer>
  );
}
