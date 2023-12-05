# Hebrew Words

This is a tool that can help you memorise the most frequantly used words in Hebrew!

## User notes

- I feel like this tool is good enough for use now. But I don't trust myself with making bug-free websites. So make sure to always export your data when you finish your studying sessions, and before you import any new lists to your current one!
- You can use the character `~` to seperate between different pronunciations of a word in the input fields for the English word and word transliteration!
    > [`auto`, `meaning 1 / meaning 2~meaning 3`, `say~sai`, `word`]

## To-Do

- [x] Add custom context menu pop-up
    - [x] Add filtering (simple CSS filtering)
    - [x] Add the ability to add individual words
    - [x] Add English words 'cover'
    - [x] Add an export/import option
    - [x] Add a reset option
    - [x] Add the option to add a word individually
- [x] Add a custom pop-up for option status selection
    - [x] Add the option to change row status
    - [x] Add the ability to reset row status
    - [x] Add the ability to remove row
    - [x] Add the ability to copy Hebrew words
    - [x] Add the ability to read aloud Hebrew words
> If I got the time, I'm probably going to work on the data safety features
- [ ] Add the ability to edit data on-screen
- [ ] Add data saftey features (tbh, I'mma just keep exporting/importing my data all the time)
    - [ ] Add the option to ignore/override duplicate words on import
    - [ ] Do a general data check whenever you import files/load the page
    - [ ] Check IndexedDB health on updates
    - [ ] Add Google Drive backups!
> I probably won't do these (unless I got time and I needed to use them)
- [ ] Add the ability to import data from "*Natsu's Sorter*"
    - [ ] Add a "*Natsu's Sorter*" export data converter
    - [ ] Support exports to "*Natsu's Sorter*"
- [ ] Add a spelling test for the blue catagory!
- [ ] Add cards slideshow (ain't got time for dat)
- [ ] Improve on-screen list
    - [ ] Do JS filtering (to fix even/odd rows bug)
    - [ ] Reorder word rows according to their rank all the time
    - [ ] Add the option to randomise rows on screen

## Notes

I currently have no plans to add across-devices sync or mobile compatibility! I am tight on time and need to use this tool :>

You are free to fork this project and improve on it!

> I am not watching out for any of the following: mobile compatibility, cross-platform/cross-browser support, web optomisations, live IndexedDB updates (not watch IndexedDB for other-tab updates or similar things)

## Credits

Default list of words - [Teach Me Hebrew](https://www.teachmehebrew.com/hebrew-frequency-list.html)

## License

MIT License
