const seed = [
  {
    id: "tt0117705",
    name: "Space Jam",
    year: 1996,
    votes: 5,
    cover:
      "https://m.media-amazon.com/images/M/MV5BMDgyZTI2YmYtZmI4ZC00MzE0LWIxZWYtMWRlZWYxNjliNTJjXkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_SX300.jpg"
  },
  {
    id: "tt0158811",
    name: "Muppets from Space",
    year: 1999,
    votes: 3,
    cover:
      "https://m.media-amazon.com/images/M/MV5BODI2Zjc5YzMtNzQ1NS00NGVmLWExYzgtMzFlY2NiMGMzZjRjXkEyXkFqcGdeQXVyNTUyMzE4Mzg@._V1_SX300.jpg"
  },
  {
    id: "tt0062622",
    name: "2001: A Space Odyssey",
    year: 1968,
    votes: 1,
    cover:
      "https://m.media-amazon.com/images/M/MV5BMmNlYzRiNDctZWNhMi00MzI4LThkZTctMTUzMmZkMmFmNThmXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg"
  }
];

const UserContext = React.createContext();

function Header() {
  return (
    <header>
      <h1>The Starry Theater</h1>
      <p className="subheading">
        The best <strong>drive-in theater</strong> around the block.
      </p>
    </header>
  );
}

function Movie(props) {
  return (
    <article>
      <h3>{props.name}</h3>
      <div className="year">Released on {props.year}</div>
      <button id={props.id} onClick={props.handleClick}>
        +1 vote
      </button>
      <div className="votes">{props.votes} votes</div>
      <img alt={`Portada de ${props.name}`} src={props.img_url} />
    </article>
  );
}

Movie.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  votes: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  img_url: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
};

function MovieList(props) {
  const { films, handleClick } = props;
  return (
    <React.Fragment>
      <h2>Now playing</h2>

      <section>
        {films.map(film => {
          return (
            <Movie
              key={film.id}
              id={film.id}
              name={film.name}
              year={film.year}
              votes={film.votes}
              handleClick={handleClick}
              img_url={film.cover}
            />
          );
        })}
      </section>
    </React.Fragment>
  );
}

MovieList.propTypes = {
  films: PropTypes.array.isRequired,
  handleClick: PropTypes.func.isRequired
};

class AddMovieForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      name: "",
      year: "",
      cover: "",
      isFormValid: true
    };

    this.handleRandomClick = this.handleRandomClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  handleRandomClick() {
    this.setState({ id: "tt" + Math.floor(Math.random() * 1000000) });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  validateForm(event) {
    event.preventDefault();
    let isValid = true;

    // Make sure to use an arrow function or this will not be bound to the
    // component inside the map callback.
    ["id", "name", "year", "cover"].map(key => {
      // Make sure to make a comparison, not an assignment .
      if (this.state[key] === "") {
        isValid = false;
      }
    });

    if (isValid) {
      this.setState({
        id: "",
        name: "",
        year: "",
        cover: "",
        isFormValid: true
      });

      // Call submit handler sent via props.
      // It is important to manually pass the event.
      this.props.handleSubmit(event);

      // The `history` prop provided by react router.
      this.props.history.push("/");
    } else {
      this.setState({ isFormValid: false });
    }
  }

  render() {
    return (
      <React.Fragment>
        <h2>Add movie</h2>

        <p>
          Welcome back <strong>{this.context.name}</strong>. You have been a
          part of this community since{" "}
          {this.context.registration_date.toDateString()}!
        </p>

        <ReactRouterDOM.Link to="/">Back to movie listing</ReactRouterDOM.Link>

        {!this.state.isFormValid && (
          <p className="form--invalid">Invalid form</p>
        )}

        <form onSubmit={this.validateForm}>
          <label>
            ID:
            <input
              type="text"
              name="id"
              value={this.state.id}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </label>
          <label>
            Publication year:
            <input
              type="number"
              name="year"
              value={this.state.year}
              onChange={this.handleChange}
            />
          </label>
          <label>
            URL to cover image:
            <input
              type="url"
              name="cover"
              value={this.state.cover}
              onChange={this.handleChange}
            />
          </label>
          <input
            type="button"
            value="Random ID"
            onClick={this.handleRandomClick}
          />
          <input type="submit" value="Submit" />
        </form>
      </React.Fragment>
    );
  }
}

AddMovieForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

AddMovieForm.contextType = UserContext;

function Homepage(props) {
  return (
    <React.Fragment>
      <Header />
      <ReactRouterDOM.Link to="/add">Add movie</ReactRouterDOM.Link>
      <MovieList {...props} />
    </React.Fragment>
  );
}

function NotFound() {
  return (
    <p>
      Nothing to see here. <strong>Just keep swimming</strong> to the{" "}
      <ReactRouterDOM.Link to="/">homepage</ReactRouterDOM.Link>.
    </p>
  );
}

class MovieApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      films: [].concat(seed),
      user: {
        name: "Dory",
        registration_date: new Date("2003-05-30T12:00:00")
      }
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleClick(event) {
    event.preventDefault();

    const clickedFilmId = event.target.id;

    this.setState(function(prevState) {
      const newFilms = prevState.films.map(function(film) {
        if (film.id === clickedFilmId) {
          return Object.assign({}, film, { votes: film.votes + 1 });
        } else {
          return film;
        }
      });

      const sortedFilms = newFilms.sort((a, b) => b.votes - a.votes);

      return { films: sortedFilms };
    });
  }

  handleSubmit(event) {
    event.preventDefault();

    const formDOM = event.target;
    const formValuesDOM = formDOM.elements;
    const newMovie = {
      id: formValuesDOM.id.value,
      name: formValuesDOM.name.value,
      year: parseInt(formValuesDOM.year.value),
      votes: 0,
      cover: formValuesDOM.cover.value
    };

    this.setState(function(prevState) {
      return { films: [...prevState.films, newMovie] };
    });
  }

  render() {
    return (
      <UserContext.Provider value={this.state.user}>
        <ReactRouterDOM.BrowserRouter>
          <ReactRouterDOM.Switch>
            <ReactRouterDOM.Route
              exact
              path="/"
              render={() => {
                return (
                  <Homepage
                    films={this.state.films}
                    handleClick={this.handleClick}
                  />
                );
              }}
            />
            <ReactRouterDOM.Route
              path="/add"
              render={routerProps => {
                // An alternative to passing react router props this way is using
                // withRouter withRouter higher-order component. See:
                // https://reacttraining.com/react-router/web/api/withRouter
                return (
                  <AddMovieForm
                    handleSubmit={this.handleSubmit}
                    {...routerProps}
                  />
                );
              }}
            />
            <ReactRouterDOM.Route component={NotFound} />
          </ReactRouterDOM.Switch>
        </ReactRouterDOM.BrowserRouter>
      </UserContext.Provider>
    );
  }
}

const renderTarget = document.getElementById("app");
ReactDOM.render(<MovieApp />, renderTarget);
