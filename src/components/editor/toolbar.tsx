import { StyledEditorToolbar } from './styles';
// @mui
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
// components
import Iconify from 'components/iconify';

// ----------------------------------------------------------------------

const HEADINGS = [
  'Heading 1',
  'Heading 2',
  'Heading 3',
  'Heading 4',
  'Heading 5',
  'Heading 6',
];

export const formats = [
  'align',
  'background',
  'blockquote',
  'bold',
  'bullet',
  'code',
  'code-block',
  'color',
  'direction',
  'font',
  'formula',
  'header',
  'image',
  'indent',
  'italic',
  'link',
  'list',
  'script',
  'size',
  'strike',
  'table',
  'underline',
  'video',
];

type EditorToolbarProps = {
  id: string;
  isSimple?: boolean;
  isHtmlMode?: boolean;
  onToggleHtmlMode?: () => void;
};

export default function Toolbar({
  id,
  isSimple,
  isHtmlMode = false,
  onToggleHtmlMode,
  ...other
}: EditorToolbarProps) {
  return (
    <StyledEditorToolbar
      {...other}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div id={id} key={id}>
        <div className="ql-formats">
          <select className="ql-header" defaultValue="">
            {HEADINGS.map((heading, index) => (
              <option key={heading} value={index + 1}>
                {heading}
              </option>
            ))}
            <option value="">Normal</option>
          </select>
        </div>

        <div className="ql-formats">
          <button type="button" className="ql-bold" />
          <button type="button" className="ql-italic" />
          <button type="button" className="ql-underline" />
          <button type="button" className="ql-strike" />
        </div>

        {!isSimple && (
          <div className="ql-formats">
            <select className="ql-color" />
            <select className="ql-background" />
          </div>
        )}

        <div className="ql-formats">
          <button type="button" className="ql-list" value="ordered" />
          <button type="button" className="ql-list" value="bullet" />
          {!isSimple && (
            <button type="button" className="ql-indent" value="-1" />
          )}
          {!isSimple && (
            <button type="button" className="ql-indent" value="+1" />
          )}
        </div>

        {!isSimple && (
          <div className="ql-formats">
            <button type="button" className="ql-script" value="super" />
            <button type="button" className="ql-script" value="sub" />
          </div>
        )}

        {!isSimple && (
          <div className="ql-formats">
            <button type="button" className="ql-code-block" />
            <button type="button" className="ql-blockquote" />
          </div>
        )}

        <div className="ql-formats">
          <button type="button" className="ql-direction" value="rtl" />
          <select className="ql-align" />
        </div>

        <div className="ql-formats">
          <button type="button" className="ql-link" />
          <button type="button" className="ql-image" />
          <button type="button" className="ql-video" />
        </div>

        <div className="ql-formats">
          {!isSimple && <button type="button" className="ql-formula" />}
          <button type="button" className="ql-clean" />
        </div>
      </div>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          ml: 2,
        }}
      >
        <Button
          size="small"
          variant={isHtmlMode ? 'contained' : 'outlined'}
          onClick={onToggleHtmlMode}
          startIcon={
            <Iconify
              icon={isHtmlMode ? 'mdi:code-tags' : 'mdi:code-tags'}
              width={18}
            />
          }
          sx={{
            minWidth: 'auto',
            px: 1.5,
            py: 0.5,
            fontSize: '0.75rem',
          }}
        >
          {isHtmlMode ? 'TXT' : 'HTML'}
        </Button>
      </Box>
    </StyledEditorToolbar>
  );
}
