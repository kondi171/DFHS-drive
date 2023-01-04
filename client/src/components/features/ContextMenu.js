import VanillaContextMenu from 'vanilla-context-menu';

const ContextMenu = ({ scope }) => {
  const defaultScope = document.querySelector('main');
  const contextMenu = new VanillaContextMenu({
    scope: scope || defaultScope,
    customThemeClass: 'context-menu',
    transitionDuration: 300,
    menuItems: [
      {
        label: 'Preview',
        // callback: () => handlePreview(),
        iconClass: 'fa fa-eye'
      },
      {
        label: 'Download',
        callback: () => console.log('Download'),
        iconClass: 'fa fa-cloud-download'
      },
      {
        label: 'Share',
        callback: () => console.log('Share'),
        iconClass: 'fa fa-share-alt'
      },
      {
        label: 'Delete',
        callback: () => console.log('Delete'),
        iconClass: 'fa fa-trash'
      },
    ],
  });
}
export default ContextMenu;