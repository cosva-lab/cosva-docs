import { sanitizeHtml } from './sanitizeHtml'

describe('Helpers Sanitize HTML', () => {
  describe('Valid', () => {
    it('Without styles', () => {
      expect(sanitizeHtml('<h1>Test</h1>')).toBe('<h1>Test</h1>')
    })
    it('with styles', () => {
      expect(sanitizeHtml('<h1 style="color: red">Test</h1>')).toBe(
        '<h1 style="color: red">Test</h1>'
      )
    })
    it('with iframe', () => {
      expect(
        sanitizeHtml(
          '<iframe src="https://www.google.com" width="100%" height="600px"></iframe>'
        )
      ).toBe(
        '<iframe src="https://www.google.com" width="100%" height="600px"></iframe>'
      )
    })

    it('with img', () => {
      expect(
        sanitizeHtml('<img src="./image.png" width="100%" height="600px" />')
      ).toBe('<img src="./image.png" width="100%" height="600px" />')
    })

    it('with img data', () => {
      expect(
        sanitizeHtml(
          '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=" width="100%" height="600px" />'
        )
      ).toBe(
        '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=" width="100%" height="600px" />'
      )
    })

    it('with image blob', () => {
      expect(
        sanitizeHtml(
          '<img src="blob:http://localhost:3000/1a2b3c4d-5678-90e1-2345-6789f0123456" />'
        )
      ).toBe(
        '<img src="blob:http://localhost:3000/1a2b3c4d-5678-90e1-2345-6789f0123456" />'
      )
    })
  })

  describe('Invalid', () => {
    it('Sanitize with script', () => {
      expect(sanitizeHtml('<script>alert("Test")</script>')).toBe('')
    })

    it('Sanitize with style', () => {
      expect(sanitizeHtml('<style>h1 { color: red }</style>')).toBe('')
    })
  })
})
