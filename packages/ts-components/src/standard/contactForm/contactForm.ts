import { defineComponent, html } from 'regor'

export type ContactFormMethod = 'get' | 'post'

export interface ContactForm {
  title?: string
  description?: string
  action?: string
  method?: ContactFormMethod
  submitLabel?: string
  nameLabel?: string
  emailLabel?: string
  topicLabel?: string
  messageLabel?: string
  namePlaceholder?: string
  emailPlaceholder?: string
  messagePlaceholder?: string
  topicGeneralLabel?: string
  topicSupportLabel?: string
  topicPartnershipLabel?: string
  resolvedMethod?: ContactFormMethod
}

const contactFormTemplate = html`<section class="contact-form">
  <div class="contact-form__header">
    <h3 class="contact-form__title">{{ title }}</h3>
    <p class="contact-form__description">{{ description }}</p>
  </div>
  <form
    class="contact-form__form"
    :action="action"
    :method="resolvedMethod"
    enctype="text/plain"
  >
    <label class="contact-form__field">
      <span class="contact-form__label">{{ nameLabel }}</span>
      <input
        class="contact-form__input"
        type="text"
        name="name"
        :placeholder="namePlaceholder"
        required
        autocomplete="name"
      />
    </label>
    <label class="contact-form__field">
      <span class="contact-form__label">{{ emailLabel }}</span>
      <input
        class="contact-form__input"
        type="email"
        name="email"
        :placeholder="emailPlaceholder"
        required
        autocomplete="email"
      />
    </label>
    <label class="contact-form__field">
      <span class="contact-form__label">{{ topicLabel }}</span>
      <select class="contact-form__select" name="topic" required>
        <option>{{ topicGeneralLabel }}</option>
        <option>{{ topicSupportLabel }}</option>
        <option>{{ topicPartnershipLabel }}</option>
      </select>
    </label>
    <label class="contact-form__field">
      <span class="contact-form__label">{{ messageLabel }}</span>
      <textarea
        class="contact-form__textarea"
        name="message"
        rows="6"
        :placeholder="messagePlaceholder"
        required
      ></textarea>
    </label>
    <div class="contact-form__actions">
      <Btn type="submit">
        {{ submitLabel }}
      </Btn>
    </div>
  </form>
</section>`

function createContactFormComponent() {
  return defineComponent<ContactForm>(contactFormTemplate, {
    props: [
      'title',
      'description',
      'action',
      'method',
      'submitLabel',
      'nameLabel',
      'emailLabel',
      'topicLabel',
      'messageLabel',
      'namePlaceholder',
      'emailPlaceholder',
      'messagePlaceholder',
      'topicGeneralLabel',
      'topicSupportLabel',
      'topicPartnershipLabel',
    ],
    context: (head) => resolveContactForm(head.props),
  })
}

export function defineContactFormComponents() {
  return {
    contactForm: createContactFormComponent(),
  }
}

function resolveContactForm(props: ContactForm): ContactForm {
  const normalizedMethod = props.method?.trim().toLowerCase()
  return {
    title: props.title || 'Send a message',
    description:
      props.description ||
      'Share context and goals so we can route your request quickly.',
    action: props.action || 'mailto:team@purestack.dev',
    method: props.method || 'post',
    resolvedMethod: normalizedMethod === 'get' ? 'get' : 'post',
    submitLabel: props.submitLabel || 'Send Message',
    nameLabel: props.nameLabel || 'Name',
    emailLabel: props.emailLabel || 'Email',
    topicLabel: props.topicLabel || 'Topic',
    messageLabel: props.messageLabel || 'Message',
    namePlaceholder: props.namePlaceholder || 'Your name',
    emailPlaceholder: props.emailPlaceholder || 'name@company.com',
    messagePlaceholder:
      props.messagePlaceholder || 'Tell us what you are trying to solve.',
    topicGeneralLabel: props.topicGeneralLabel || 'General inquiry',
    topicSupportLabel: props.topicSupportLabel || 'Technical support',
    topicPartnershipLabel: props.topicPartnershipLabel || 'Partnership',
  }
}
