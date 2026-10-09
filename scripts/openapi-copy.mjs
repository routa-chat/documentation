// Portuguese copy applied by build-openapi.mjs on top of the generated spec.
// Keep summaries short: Mintlify uses them as page titles.

const ID = (prefix) => `${prefix}_01J8ZK9M3Q7XABCDEFGHJKMNPQ`
const TS = '2026-09-04T13:22:41.031Z'

export const COPY = {
  info: {
    title: 'API da Routa',
    description:
      'API REST para enviar e receber mensagens de WhatsApp, acompanhar a entrega e receber eventos normalizados por webhook.',
    version: '1',
  },

  tags: [
    { name: 'Mensagens', description: 'Envie, consulte e liste mensagens.' },
    { name: 'Eventos', description: 'Consulte o log de eventos normalizados.' },
    { name: 'Webhooks', description: 'Gerencie endpoints de webhook, segredos e entregas.' },
    { name: 'Templates', description: 'Submeta e consulte templates de WhatsApp.' },
    { name: 'Mídia', description: 'Envie e obtenha arquivos de mídia.' },
    { name: 'Uso', description: 'Consulte o uso medido do projeto.' },
    { name: 'Identidade', description: 'Identifique a chave de API em uso.' },
  ],

  statuses: {
    200: 'Sucesso',
    201: 'Recurso criado',
    202: 'Aceito. O processamento é assíncrono',
    401: 'Chave de API ausente, inválida, revogada ou expirada (`api_key_invalid`)',
    402: 'Franquia ou limite do plano esgotado (`message_quota_exceeded`, `subscription_required`, `payment_failed`)',
    403: 'A chave não tem o escopo necessário (`insufficient_scope`)',
    404: 'O recurso não existe ou pertence a outro projeto',
    409: 'Conflito de idempotência ou de estado',
    422: 'Requisição inválida',
    429: 'Limite de taxa excedido. Veja o header `Retry-After`',
  },

  params: {
    id: 'Identificador do recurso.',
    limit: 'Quantidade de itens por página, de 1 a 100. O padrão é 20.',
    cursor: 'Valor de `next_cursor` da página anterior. Trate-o como opaco.',
    after: 'Retoma a listagem depois deste id de evento (`evt_...`).',
    type: 'Filtra por tipo de evento.',
    direction: 'Filtra pela direção da mensagem: `inbound` (recebida) ou `outbound` (enviada).',
    channel: 'Filtra pelo id do canal (`chan_...`).',
    state: 'Filtra pelo estado da entrega.',
    deliveryId: 'Identificador da entrega (`whd_...`).',
    from: 'Data UTC inicial, no formato `YYYY-MM-DD`, inclusiva.',
    to: 'Data UTC final, no formato `YYYY-MM-DD`, exclusiva. O intervalo tem no máximo 92 dias.',
  },

  operationOrder: [
    'POST /v1/messages',
    'GET /v1/messages',
    'GET /v1/messages/{id}',
    'POST /v1/messages/{id}/read',
    'GET /v1/events',
    'POST /v1/webhook_endpoints',
    'GET /v1/webhook_endpoints',
    'GET /v1/webhook_endpoints/{id}',
    'PATCH /v1/webhook_endpoints/{id}',
    'POST /v1/webhook_endpoints/{id}/rotate_secret',
    'POST /v1/webhook_endpoints/{id}/disable',
    'POST /v1/webhook_endpoints/{id}/enable',
    'GET /v1/webhook_endpoints/{id}/deliveries',
    'POST /v1/webhook_endpoints/{id}/deliveries/{deliveryId}/replay',
    'POST /v1/webhook_endpoints/{id}/deliveries/replay',
    'POST /v1/templates',
    'GET /v1/templates',
    'GET /v1/templates/{id}',
    'POST /v1/templates/media',
    'POST /v1/media',
    'GET /v1/media/{id}',
    'GET /v1/usage',
    'GET /v1/whoami',
  ],

  operations: {
    'POST /v1/messages': {
      id: 'sendMessage',
      tag: 'Mensagens',
      scope: 'messages:write',
      summary: 'Enviar mensagem',
      description:
        'Envia uma mensagem de texto ou de template por um canal.\n\nA resposta é `202 Accepted`: a mensagem foi gravada de forma durável, mas **ainda não foi entregue**. Acompanhe `sent`, `delivered`, `read` e `failed` por [webhooks](/webhooks/overview) ou por `GET /v1/messages/{id}`.\n\nInforme **exatamente um** entre `text` e `template`. Envie o header `Idempotency-Key` para repetir a requisição com segurança. Veja [Idempotência](/reliability/idempotency).\n\nA validação do canal, do destinatário e do template acontece no aceite e retorna `422` imediatamente.',
      headers: [
        {
          name: 'Idempotency-Key',
          in: 'header',
          required: false,
          description:
            'Chave única por mensagem lógica (um UUID v4, por exemplo). Repetir a requisição com a mesma chave e o mesmo corpo devolve a resposta original, com o header `Idempotent-Replay: true`. Uma chave reutilizada com outro corpo retorna `409 idempotency_key_reuse`. O registro é mantido por 24 horas.',
          schema: { type: 'string' },
          example: '6f0a9d9e-3c1f-4e56-9a64-2b7f6a5c1d10',
        },
      ],
      requestNotes: {
        channel: { description: 'Identificador do canal pelo qual enviar (`chan_...`).', example: 'chan_01J8ZK9M3Q7XABCDEFGHJKMNPQ' },
        to: { description: 'Destinatário em formato E.164, por exemplo `+5581999999999`. O `+` inicial é opcional. O formato é verificado aqui; se o número não pode existir no país indicado, a API retorna `invalid_recipient`.', example: '+5581999999999' },
        text: { description: 'Corpo da mensagem de texto. Não pode ser usado junto com `template`.', example: 'Olá! Seu pedido foi confirmado.' },
        template: 'Template aprovado a enviar. Não pode ser usado junto com `text`.',
        'template.id': { description: 'Identificador do template (`tmpl_...`). O template precisa estar `approved`.', example: 'tmpl_01J8ZK9M3Q7XABCDEFGHJKMNPQ' },
        'template.body_parameters': 'Valores posicionais para os placeholders `{{1}}`, `{{2}}`, … do corpo do template, na ordem. A quantidade precisa bater com a de variáveis do template.',
        metadata: 'Até 20 pares chave-valor de texto, de propriedade do cliente, com 1 KB no total. É devolvido na consulta e nos eventos.',
      },
      requestExample: {
        channel: 'chan_01J8ZK9M3Q7XABCDEFGHJKMNPQ',
        to: '+5581999999999',
        text: 'Olá! Seu pedido foi confirmado.',
        metadata: { order_id: '1234' },
      },
    },
    'GET /v1/messages': {
      id: 'listMessages',
      tag: 'Mensagens',
      scope: 'messages:read',
      summary: 'Listar mensagens',
      description:
        'Lista as mensagens do projeto, da mais recente para a mais antiga, com paginação por cursor. Filtre por `direction` para ver só as recebidas ou só as enviadas.',
    },
    'GET /v1/messages/{id}': {
      id: 'retrieveMessage',
      tag: 'Mensagens',
      scope: 'messages:read',
      summary: 'Consultar mensagem',
      description:
        'Retorna uma mensagem com o status atual e os horários de cada etapa (`sent_at`, `delivered_at`, `read_at`, `failed_at`).',
      params: { id: 'Identificador da mensagem (`msg_...`).' },
    },
    'POST /v1/messages/{id}/read': {
      id: 'markMessageAsRead',
      tag: 'Mensagens',
      scope: 'messages:write',
      summary: 'Marcar mensagem como lida',
      description:
        'Marca uma mensagem **recebida** (`inbound`) como lida e envia a confirmação de leitura ao remetente. Para uma mensagem enviada por você, retorna `422` com o código `message_direction_invalid`.',
      params: { id: 'Identificador da mensagem recebida (`msg_...`).' },
    },
    'GET /v1/events': {
      id: 'listEvents',
      tag: 'Eventos',
      scope: 'events:read',
      summary: 'Listar eventos',
      description:
        'Lista os eventos do projeto em ordem crescente de `sequence`, do mais antigo para o mais recente. É o caminho de **reconciliação** para quem perdeu entregas de webhook: guarde o `id` do último evento processado e passe-o em `after`.\n\nOs eventos ficam disponíveis por 90 dias. Veja [Reconciliar eventos](/webhooks/reconciliation).',
    },
    'POST /v1/webhook_endpoints': {
      id: 'createWebhookEndpoint',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Criar endpoint de webhook',
      description:
        'Registra uma URL para receber eventos. A resposta inclui o `secret` de assinatura, **exibido uma única vez**. Guarde-o para [verificar as assinaturas](/webhooks/signatures).\n\nA URL deve usar HTTPS e não pode apontar para endereços privados. `http://localhost` é aceito apenas em projetos de teste. Cada projeto pode ter até 5 endpoints.',
      requestNotes: {
        url: { description: 'URL HTTPS que recebe os eventos. `http://` é aceito apenas para localhost em projetos de teste.', example: 'https://exemplo.com/webhooks/routa' },
        subscribed_types: { description: 'Tipos de evento ou curingas por recurso (`message.*`, `channel.*`, `template.*`). Pelo menos um.', example: ['message.*', 'channel.status_changed'] },
      },
      requestExample: {
        url: 'https://exemplo.com/webhooks/routa',
        subscribed_types: ['message.*', 'channel.status_changed'],
      },
    },
    'GET /v1/webhook_endpoints': {
      id: 'listWebhookEndpoints',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Listar endpoints de webhook',
      description:
        'Lista os endpoints de webhook do projeto (no máximo 5). O `secret` nunca é retornado nas listagens.',
    },
    'GET /v1/webhook_endpoints/{id}': {
      id: 'retrieveWebhookEndpoint',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Consultar endpoint de webhook',
      description:
        'Retorna um endpoint, incluindo `status`, `consecutive_failures` e os horários do último sucesso e da última falha.',
      params: { id: 'Identificador do endpoint (`whe_...`).' },
    },
    'PATCH /v1/webhook_endpoints/{id}': {
      id: 'updateWebhookEndpoint',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Atualizar tipos assinados',
      description:
        'Substitui a lista de tipos de evento assinados pelo endpoint. A lista não pode ser vazia e aceita curingas como `message.*`.',
      requestNotes: {
        subscribed_types: { description: 'Nova lista de tipos ou curingas. Substitui a lista atual.', example: ['message.delivered', 'message.failed'] },
      },
      requestExample: { subscribed_types: ['message.delivered', 'message.failed'] },
      params: { id: 'Identificador do endpoint (`whe_...`).' },
    },
    'POST /v1/webhook_endpoints/{id}/rotate_secret': {
      id: 'rotateWebhookEndpointSecret',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Rotacionar segredo',
      description:
        'Gera um novo segredo de assinatura e o retorna. O segredo anterior continua válido por **24 horas**, e durante esse período as entregas são assinadas com os dois. Veja [Verificar assinaturas](/webhooks/signatures).',
      params: { id: 'Identificador do endpoint (`whe_...`).' },
    },
    'POST /v1/webhook_endpoints/{id}/disable': {
      id: 'disableWebhookEndpoint',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Desativar endpoint',
      description:
        'Pausa as entregas para o endpoint (`status: disabled_by_user`). Os eventos continuam sendo gravados no log.',
      params: { id: 'Identificador do endpoint (`whe_...`).' },
    },
    'POST /v1/webhook_endpoints/{id}/enable': {
      id: 'enableWebhookEndpoint',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Reativar endpoint',
      description:
        'Reativa um endpoint desativado e **reenvia em lote** todas as entregas esgotadas. A resposta informa quantas foram reenviadas em `replayed_count`.',
      params: { id: 'Identificador do endpoint (`whe_...`).' },
    },
    'GET /v1/webhook_endpoints/{id}/deliveries': {
      id: 'listWebhookDeliveries',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Listar entregas',
      description:
        'Lista as entregas de um endpoint, da mais recente para a mais antiga. Filtre por `state=exhausted` para ver as entregas que esgotaram as tentativas. As entregas ficam consultáveis por 30 dias.',
      params: { id: 'Identificador do endpoint (`whe_...`).' },
    },
    'POST /v1/webhook_endpoints/{id}/deliveries/{deliveryId}/replay': {
      id: 'replayWebhookDelivery',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Reenviar uma entrega',
      description:
        'Reenvia uma entrega no estado `exhausted`. Uma entrega em outro estado retorna `409` com o código `webhook_delivery_not_replayable`.',
      params: { id: 'Identificador do endpoint (`whe_...`).' },
    },
    'POST /v1/webhook_endpoints/{id}/deliveries/replay': {
      id: 'replayWebhookDeliveries',
      tag: 'Webhooks',
      scope: 'webhooks:write',
      summary: 'Reenviar todas as entregas esgotadas',
      description:
        'Reenvia, de uma vez, todas as entregas esgotadas do endpoint. Retorna a quantidade reenviada.',
      params: { id: 'Identificador do endpoint (`whe_...`).' },
    },
    'POST /v1/templates': {
      id: 'createTemplate',
      tag: 'Templates',
      scope: 'templates:write',
      summary: 'Submeter template',
      description:
        'Cria um template e o envia ao WhatsApp para aprovação. A aprovação é decidida pelo provedor, no tempo dele. Acompanhe pelos eventos `template.*` ou consultando o template.\n\nSomente templates `approved` podem ser usados em `POST /v1/messages`. Veja [Templates](/concepts/templates).',
      requestNotes: {
        channel: { description: 'Canal ao qual o template pertence (`chan_...`).', example: 'chan_01J8ZK9M3Q7XABCDEFGHJKMNPQ' },
        name: { description: 'Nome do template.', example: 'confirmacao_pedido' },
        language: { description: 'Código de idioma, por exemplo `pt_BR` ou `en_US`.', example: 'pt_BR' },
        category: 'Categoria do template: `marketing`, `utility` ou `authentication`.',
        body_text: { description: 'Corpo do template, com placeholders posicionais `{{1}}`, `{{2}}`, …', example: 'Olá {{1}}! Seu pedido {{2}} foi confirmado.' },
        components: 'Componentes opcionais: cabeçalho de texto ou de mídia, rodapé e até 10 botões. Omita o campo para um template só de texto.',
        'components.header': 'Cabeçalho de texto (até 60 caracteres e uma variável) ou de mídia (um `media_id` de `POST /v1/templates/media`).',
        'components.footer': 'Rodapé em texto, com até 60 caracteres.',
        'components.buttons': 'Até 10 botões. No máximo um botão `phone_number`. O texto de cada botão tem até 25 caracteres, e a URL de um botão `url` pode ter uma variável `{{1}}`.',
      },
      requestExample: {
        channel: 'chan_01J8ZK9M3Q7XABCDEFGHJKMNPQ',
        name: 'confirmacao_pedido',
        language: 'pt_BR',
        category: 'utility',
        body_text: 'Olá {{1}}! Seu pedido {{2}} foi confirmado.',
      },
    },
    'GET /v1/templates': {
      id: 'listTemplates',
      tag: 'Templates',
      scope: 'templates:read',
      summary: 'Listar templates',
      description: 'Lista os templates do projeto com paginação por cursor. Filtre por canal com `channel`.',
    },
    'GET /v1/templates/{id}': {
      id: 'retrieveTemplate',
      tag: 'Templates',
      scope: 'templates:read',
      summary: 'Consultar template',
      description:
        'Retorna um template com o `status` de aprovação atual. Se ele foi rejeitado, `rejection_reason` indica o motivo.',
      params: { id: 'Identificador do template (`tmpl_...`).' },
    },
    'POST /v1/templates/media': {
      id: 'uploadTemplateMedia',
      tag: 'Templates',
      scope: 'templates:write',
      summary: 'Enviar mídia de cabeçalho',
      description:
        'Envia uma imagem, um vídeo ou um documento para usar como cabeçalho de um template. Envie os bytes do arquivo **diretamente no corpo**, com o `Content-Type` do arquivo. O formato é deduzido do tipo.\n\n| Formato | Tipos aceitos | Tamanho máximo |\n| --- | --- | --- |\n| `image` | `image/jpeg`, `image/png` | 5 MB |\n| `video` | `video/mp4` | 16 MB |\n| `document` | `application/pdf` | 100 MB |\n\nUse o `id` retornado em `components.header.media_id` ao submeter o template.',
      requestBody: {
        required: true,
        description: 'Os bytes do arquivo, com o `Content-Type` do arquivo (por exemplo `image/png`).',
        content: {
          'application/octet-stream': { schema: { type: 'string', format: 'binary' } },
        },
      },
    },
    'POST /v1/media': {
      id: 'uploadMedia',
      tag: 'Mídia',
      scope: 'media:write',
      summary: 'Enviar ou hospedar mídia',
      description:
        'Armazena um arquivo de mídia sob custódia da Routa. Há duas formas, escolhidas pelo `Content-Type`:\n\n- **Bytes:** envie o arquivo no corpo, com o `Content-Type` do arquivo.\n- **URL:** envie `application/json` com `{ "source_url": "https://..." }` e a Routa baixa o arquivo. A URL precisa ser pública.\n\nOs tipos e os tamanhos aceitos seguem os limites do WhatsApp. Veja [Mídia](/concepts/media).',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['source_url'],
              properties: {
                source_url: {
                  type: 'string',
                  format: 'uri',
                  description: 'URL pública do arquivo que a Routa deve baixar.',
                  example: 'https://exemplo.com/imagem.png',
                },
              },
            },
          },
          'application/octet-stream': {
            schema: {
              type: 'string',
              format: 'binary',
              description: 'Os bytes do arquivo. Use o `Content-Type` real do arquivo, por exemplo `image/jpeg`.',
            },
          },
        },
      },
    },
    'GET /v1/media/{id}': {
      id: 'retrieveMedia',
      tag: 'Mídia',
      scope: 'media:read',
      summary: 'Consultar mídia',
      description:
        'Retorna o objeto de mídia com uma **URL assinada nova**, válida por 15 minutos, quando `status` é `ready`. Se estiver `pending`, repita a consulta em instantes.',
      params: { id: 'Identificador da mídia (`med_...`).' },
    },
    'GET /v1/usage': {
      id: 'retrieveUsage',
      tag: 'Uso',
      scope: 'usage:read',
      summary: 'Consultar uso',
      description:
        'Retorna o uso medido do projeto no período, com uma linha por combinação de métrica, tipo de canal e provedor. O dia corrente ainda aberto é lido ao vivo. O intervalo tem no máximo 92 dias.',
    },
    'GET /v1/whoami': {
      id: 'whoami',
      tag: 'Identidade',
      scope: undefined,
      summary: 'Identificar a chave de API',
      description:
        'Resolve a chave de API em uso para a organização, o projeto e os escopos que ela possui. Não tem efeitos colaterais e aceita qualquer chave válida, o que o torna ideal para verificar uma chave.',
    },
  },

  schemas: {
    Error: {
      error: 'Detalhes do erro.',
      'error.type': {
        description:
          'Categoria do erro: `invalid_request_error`, `authentication_error`, `permission_error`, `not_found_error`, `conflict_error`, `rate_limit_error`, `billing_error` ou `api_error`.',
        example: 'invalid_request_error',
      },
      'error.code': {
        description: 'Código estável e legível por máquina. Veja [Códigos de erro](/errors/error-codes).',
        example: 'channel_inactive',
      },
      'error.message': {
        description: 'Texto para humanos, em inglês. Pode mudar, então não faça parse dele.',
        example: 'Channel chan_01J8... is not active and cannot send messages.',
      },
      'error.param': 'O campo da requisição com problema, quando se aplica.',
      'error.doc_url': 'Link para a documentação do código, quando disponível.',
      'error.details': 'Valores acionáveis, como `limit`, `used` e `resets_at` em `message_quota_exceeded`.',
      'error.request_id': {
        description: 'Identificador da requisição. Informe-o ao falar com o suporte.',
        example: 'req_01J8ZK9M3Q7XABCDEFGHJKMNPQ',
      },
    },
    Message: {
      id: { description: 'Identificador da mensagem.', example: ID('msg') },
      channel: { description: 'Identificador do canal usado.', example: ID('chan') },
      direction: 'Direção da mensagem: `outbound` (enviada por você) ou `inbound` (recebida).',
      from: { description: 'Endereço de origem, em E.164.', example: '+5581988888888' },
      to: { description: 'Endereço de destino, em E.164.', example: '+5581999999999' },
      content: 'Conteúdo da mensagem. O campo `type` indica o formato.',
      status: 'Estado atual no ciclo de vida. O status nunca retrocede.',
      metadata: 'Até 20 pares chave-valor de texto, de propriedade do cliente.',
      accepted_at: { description: 'Quando a Routa aceitou a mensagem.', example: TS },
      sent_at: { description: 'Quando o provedor aceitou a mensagem. `null` se ainda não ocorreu.', example: TS },
      delivered_at: { description: 'Quando a entrega foi confirmada. `null` se ainda não ocorreu.', example: TS },
      read_at: { description: 'Quando o destinatário leu. `null` se ainda não ocorreu.', example: null },
      failed_at: { description: 'Quando a mensagem falhou. `null` se não falhou.', example: null },
    },
    MessageList: {
      data: 'Mensagens da página.',
      has_more: 'Indica se existem mais páginas.',
      next_cursor: 'Cursor da próxima página, ou `null` na última.',
    },
    Event: {
      id: { description: 'Identificador do evento. É a chave de deduplicação.', example: ID('evt') },
      type: 'Tipo do evento, no formato `recurso.ação_no_passado`.',
      api_version: { description: 'Versão do formato público do recurso em `data`.', example: 'v1' },
      schema_version: { description: 'Versão do envelope do evento.', example: 1 },
      project_id: { description: 'Projeto dono do evento.', example: ID('proj') },
      sequence: 'Número monotônico, útil para detectar lacunas. Não é uma promessa de ordem de entrega.',
      occurred_at: { description: 'Quando o fato ocorreu.', example: TS },
      recorded_at: { description: 'Quando a Routa registrou o evento.', example: TS },
      data: 'O recurso completo no estado atual, não um diff. Para eventos de mensagem é a mensagem, para eventos de template é o template.',
    },
    EventList: {
      data: 'Eventos da página.',
      has_more: 'Indica se existem mais eventos.',
      next_cursor: 'Id do último evento da página, ou `null` na última. Use-o em `after`.',
    },
    Template: {
      id: { description: 'Identificador do template.', example: ID('tmpl') },
      channel: { description: 'Canal ao qual o template pertence.', example: ID('chan') },
      name: { description: 'Nome do template.', example: 'confirmacao_pedido' },
      language: { description: 'Código de idioma.', example: 'pt_BR' },
      category: 'Categoria: `marketing`, `utility` ou `authentication`.',
      variables: 'Placeholders posicionais do corpo (`{{1}}`, `{{2}}`, …).',
      components: 'Cabeçalho, rodapé e botões do template, quando existirem.',
      status: 'Estado de aprovação. Somente `approved` permite enviar.',
      rejection_reason: 'Motivo da rejeição, quando `status` é `rejected`.',
      created_at: { description: 'Quando o template foi criado.', example: TS },
      updated_at: { description: 'Quando o template foi atualizado pela última vez.', example: TS },
    },
    TemplateList: {
      data: 'Templates da página.',
      has_more: 'Indica se existem mais páginas.',
      next_cursor: 'Cursor da próxima página, ou `null` na última.',
    },
    WebhookEndpoint: {
      id: { description: 'Identificador do endpoint.', example: ID('whe') },
      url: { description: 'URL que recebe os eventos.', example: 'https://exemplo.com/webhooks/routa' },
      subscribed_types: 'Tipos de evento assinados, incluindo curingas como `message.*`.',
      api_version: 'Versão da API fixada na criação do endpoint.',
      status: 'Estado do endpoint: `enabled`, `disabled_by_user` ou `disabled_by_system`.',
      consecutive_failures: 'Falhas consecutivas de entrega. Zera a cada sucesso.',
      last_success_at: 'Último sucesso de entrega, ou `null`.',
      last_failure_at: 'Última falha de entrega, ou `null`.',
      created_at: { description: 'Quando o endpoint foi criado.', example: TS },
    },
    WebhookEndpointWithSecret: {
      id: { description: 'Identificador do endpoint.', example: ID('whe') },
      url: { description: 'URL que recebe os eventos.', example: 'https://exemplo.com/webhooks/routa' },
      subscribed_types: 'Tipos de evento assinados, incluindo curingas como `message.*`.',
      api_version: 'Versão da API fixada na criação do endpoint.',
      status: 'Estado do endpoint: `enabled`, `disabled_by_user` ou `disabled_by_system`.',
      consecutive_failures: 'Falhas consecutivas de entrega. Zera a cada sucesso.',
      last_success_at: 'Último sucesso de entrega, ou `null`.',
      last_failure_at: 'Última falha de entrega, ou `null`.',
      created_at: { description: 'Quando o endpoint foi criado.', example: TS },
      secret: {
        description: 'Segredo de assinatura. Exibido apenas na criação e na rotação. Guarde-o com segurança.',
        example: 'whsec_...',
      },
    },
    WebhookEndpointList: {
      data: 'Endpoints do projeto.',
      has_more: 'Indica se existem mais páginas. Hoje é sempre `false`.',
      next_cursor: 'Sempre `null`. A listagem retorna todos os endpoints de uma vez.',
    },
    WebhookDelivery: {
      id: { description: 'Identificador da entrega.', example: ID('whd') },
      event_id: { description: 'Evento entregue.', example: ID('evt') },
      event_type: { description: 'Tipo do evento entregue.', example: 'message.delivered' },
      state: 'Estado da entrega: `pending`, `in_flight`, `retrying`, `succeeded` ou `exhausted`.',
      attempt_count: 'Tentativas realizadas.',
      next_attempt_at: 'Quando ocorre a próxima tentativa.',
      last_response_status: 'Status HTTP da última resposta do seu servidor, ou `null`.',
      last_error_code: 'Código do último erro, como timeout ou falha de conexão, ou `null`.',
      succeeded_at: 'Quando a entrega teve sucesso, ou `null`.',
      exhausted_at: 'Quando esgotou as tentativas, ou `null`.',
      created_at: { description: 'Quando a entrega foi criada.', example: TS },
    },
    WebhookDeliveryList: {
      data: 'Entregas da página.',
      has_more: 'Indica se existem mais páginas.',
      next_cursor: 'Cursor da próxima página, ou `null` na última.',
    },
    ReplayResult: {
      replayed_count: { description: 'Quantidade de entregas reenviadas.', example: 12 },
    },
    Media: {
      id: { description: 'Identificador da mídia.', example: ID('med') },
      content_type: { description: 'Tipo MIME do arquivo.', example: 'image/jpeg' },
      status: 'Estado: `pending`, `ready` ou `unavailable`.',
      url: 'URL assinada com validade de 15 minutos. Presente apenas quando `status` é `ready`.',
    },
    TemplateMedia: {
      id: { description: 'Identificador da mídia de cabeçalho. Use-o em `components.header.media_id`.', example: ID('tmedia') },
      format: 'Formato: `image`, `video` ou `document`.',
      size_bytes: 'Tamanho do arquivo, em bytes.',
      content_type: { description: 'Tipo MIME do arquivo.', example: 'image/png' },
      created_at: { description: 'Quando o arquivo foi enviado.', example: TS },
    },
    Usage: {
      from_date: { description: 'Início do período (inclusivo).', example: '2026-09-01' },
      to_date: { description: 'Fim do período (exclusivo).', example: '2026-10-01' },
      data: 'Uma linha por combinação de métrica, tipo de canal e provedor.',
      'data.[].metric': { description: 'Métrica medida.', example: 'message.sent' },
      'data.[].channel_type': { description: 'Tipo do canal, ou `null`.', example: 'whatsapp' },
      'data.[].provider': { description: 'Provedor, ou `null`.', example: 'whatsapp_cloud' },
      'data.[].quantity': { description: 'Quantidade no período.', example: 1840 },
      'data.[].unit': { description: 'Unidade da métrica.', example: 'message' },
    },
    Whoami: {
      organization_id: { description: 'Organização dona da chave.', example: ID('org') },
      project_id: { description: 'Projeto ao qual a chave pertence.', example: ID('proj') },
      api_key_id: { description: 'Identificador da chave.', example: ID('key') },
      scopes: 'Escopos concedidos à chave.',
    },
  },
}
