import { GithubUser } from "./githubUser.js";

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.data = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.data));
  }

  async add(username) {
    try {
      const userExist = this.data.find((data) => data.login === username);
      if (userExist) {
        throw new Error("Usuário já cadastrado!");
      }

      const user = await GithubUser.search(username);
      if (user.login === undefined) {
        throw new Error("Usuário não encontrado!");
      }

      this.data = [user, ...this.data];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredData = this.data.filter(
      (entry) => entry.login !== user.login
    );
    this.data = filteredData;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = document.querySelector("table tbody");
    this.update();
    this.onadd();
  }

  update() {
    this.removeAllTr();
    this.data.forEach((user) => {
      const row = this.createRow();

      // prettier-ignore
      row.querySelector(".user img").src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `Image of ${user.name}`;
      row.querySelector(".user p").textContent = user.name;
      // prettier-ignore
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user span").textContent = "/" + user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;
      row.querySelector(".remove").onclick = () => {
        let confirmed = confirm("Tem certeza que deseja remover esse perfil?");
        if (confirmed) {
          this.delete(user);
        }
      };

      this.tbody.append(row);
    });
  }

  onadd() {
    const addBtn = this.root.querySelector("#submit");
    addBtn.onclick = () => {
      const { value } = this.root.querySelector("#input-user");
      this.add(value);
    };
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }

  createRow() {
    const tr = document.createElement("tr");
    // prettier-ignore
    tr.innerHTML = 
    `<tr>
        <td>
            <div class="user">
                <img
                src="https://github.com/celinxt.png"
                alt="User profile image" />

                <a href="https://github.com/celinxt" target="_blank">
                    <p>Marcelo Fianco</p>
                    <span>/celinxt</span>
                </a>
            </div>
        </td>
        <td class="repositories">123</td>
        <td class="followers">1234</td>
        <td class="remove"><button>Remove</button></td>
    </tr>`;

    return tr;
  }
}
