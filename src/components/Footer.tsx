export default function Footer() {
    return (
      <footer className="bg-slate-900 text-white text-center py-4 mt-8">
      <small>
        © {new Date().getFullYear()} Pelu PetShop — Todos los derechos reservados.
      </small>
    </footer>
    );
  }