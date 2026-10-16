# CodeConnect Directory: Month 1 Project Plan

## Project overview

People looking for technology learning and early-career opportunities often have to search many different websites. CodeConnect Directory puts example learning resources, courses, internship search resources and career information in one place. Visitors can search, filter by category and location, and save useful entries as favourites.

The main users are CAPACITI learners and other people starting or growing a technology career. The directory can also help a maintainer keep useful links organized.

## Project files

- `index.html` contains the page sections, navigation, search controls and contact form.
- `style.css` controls the colors, layout, responsive design and focus styles.
- `script.js` loads the data, displays cards, applies filters, saves favourites and validates the form.
- `data.json` stores the example directory records separately from the page.
- `README.md` contains this plan and the instructions for running the project.

## Open and run in VS Code

1. In VS Code, choose **File > Open Folder**.
2. Select the `Javascript-Content-Directory` project folder.
3. Open **Terminal > New Terminal**. Make sure the terminal is in the folder containing `index.html` and `data.json`.
4. If Python is installed, start a local web server:

	```powershell
	py -m http.server 8000
	```

5. Open `http://localhost:8000` in a browser. The local server is needed because the page uses `fetch()` to load `data.json`; opening `index.html` directly may block that request.
6. To stop the server, return to the terminal and press `Ctrl+C`.

If you already use a VS Code local-server extension, you can open `index.html` with that extension instead.

## User stories

1. As a learner, I want to search resource titles and descriptions, so that I can find a useful option quickly.
2. As a learner, I want to filter by category, so that I can focus on courses, resources, internships or career information.
3. As a learner, I want to filter by location, so that I can find options related to Cape Town, Johannesburg, Durban or remote study.
4. As a visitor, I want search and both filters to work together, so that I can narrow the directory to a useful result.
5. As a returning visitor, I want to save and remove favourites, so that I can keep track of resources I may want to revisit.
6. As a visitor, I want loading, empty and error messages, so that I understand what the directory is doing.
7. As a visitor, I want clear contact-form validation, so that I can correct missing details or an invalid email address.
8. As a maintainer, I want resource records in a separate JSON file, so that I can update the sample directory without rebuilding its HTML structure.

## Functional requirements

- When the page opens, JavaScript fetches `data.json` and displays a loading message until the request finishes.
- If loading fails, the page explains the problem and provides a retry button.
- JavaScript creates a card for each record. Cards show the title, category, location, description, provider or type, and a link when one is available.
- Search updates as the visitor types, ignores letter case and checks relevant resource fields.
- Category and location options are based on the loaded data. Both filters can be combined with search.
- Clear Filters empties the search and returns both dropdowns to their all-options setting.
- The results count changes whenever the matching records change. If nothing matches, the page shows a no-results message.
- A favourite button adds or removes a resource. Favourite IDs are stored in this browser and the saved cards appear in the Favourites section.
- The contact form checks that name, email and message are valid. It shows field errors or a success message; it does not send an email.
- The layout adjusts for phone, tablet and desktop screens, and the native links, fields and buttons can be reached with a keyboard.

## Low-fidelity wireframe

```text
+------------------------------------------------------------------+
| CodeConnect Directory       Home | Browse | Favourites | Contact |
|                                                   Project Plan    |
+------------------------------------------------------------------+
| INTRODUCTION                                                     |
| Discover learning, courses, internships and career resources     |
|                                                         [15]      |
+------------------------------------------------------------------+
| BROWSE RESOURCES                                                 |
| [ Search by title, keyword or location                         ] |
| [ Category v ] [ Location v ] [ Clear Filters ]                  |
| Results count and loading, empty or error message                 |
| [ Resource card ] [ Resource card ] [ Resource card ]            |
| [ Resource card ] [ Resource card ] [ Resource card ]            |
+------------------------------------------------------------------+
| FAVOURITES                                                       |
| [ Saved resource cards, or an empty favourites message ]         |
+------------------------------------------------------------------+
| CONTACT                                                          |
| [ Name ] [ Email ] [ Message                         ] [ Submit ]|
+------------------------------------------------------------------+
| MONTH 1 PROJECT PLAN                                             |
| User stories and text wireframes                                 |
+------------------------------------------------------------------+
| Footer                                                           |
+------------------------------------------------------------------+
```

## Four-week development plan

### Week 1: Plan and structure

- Agree on the audience, problem and first version of the features.
- Write user stories and sketch the page layout.
- Build the semantic HTML sections and connect the CSS and JavaScript files.

### Week 2: Style and make it responsive

- Choose the visual palette, typography and card layout.
- Style navigation, search controls, cards, form and project plan.
- Check the layout at phone, tablet and desktop widths; keep keyboard focus visible.

### Week 3: Load and find resources

- Add sample records to `data.json`.
- Fetch the JSON and display loading, error and card states.
- Add search, category and location filters, result counts, empty results and Clear Filters.

### Week 4: Finish and test

- Add localStorage favourites and contact-form validation.
- Test the main user stories and repair problems found.
- Review accessibility, update this README and prepare a short project demonstration.

## Testing plan

- **Data loading and cards:** Run the site through the local server. Confirm the resource count matches the records in `data.json` and that each card shows its details.
- **Search:** Search a known title or provider. Repeat with uppercase letters and a location or category term. Confirm the matching cards and count update.
- **Filters:** Select one category, then one location. Try using both with a search term. Confirm only matching cards remain.
- **Clear and empty results:** Use a search term that cannot match anything, check the empty message, then use Clear Filters and confirm all cards return.
- **Loading and errors:** Reload and observe the loading message. In browser developer tools, block the `data.json` request and reload to check the error and retry button. Unblock it and retry.
- **Favourites:** Save a card, refresh the page and confirm it remains in Favourites. Remove it and confirm it disappears.
- **Contact form:** Submit empty fields, then an invalid email, and confirm field messages appear. Enter valid details and confirm the demo success message appears without a page reload or email claim.
- **Responsive and keyboard checks:** Use browser developer tools to test around 375px, 768px and 1280px. Look for horizontal scrolling, then use Tab, Shift+Tab, Enter and Space to move through and activate controls.

## Known limitations

- The directory reads a local `data.json` file. It does not use a database or automatically update its records.
- The sample internship and career entries are demonstrations, not verified current vacancies. Their links go to provider or organization homepages; check those sites for current details.
- Favourites use browser `localStorage`. They are saved only in that browser on that device, not to a user account.
- The contact form only validates input and displays a demonstration message. There is no backend to send or store suggestions.
